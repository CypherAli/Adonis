"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'

interface CartItem {
  id?: string
  _id?: string
  product: any
  quantity: number
  size?: string
  color?: string
}

interface CartContextType {
  cartItems: CartItem[]
  addToCart: (product: any, quantity?: number, size?: string, color?: string) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  cartCount: number
  cartTotal: number
  loading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(false)

  // Helper function to merge duplicate items
  const mergeDuplicateItems = useCallback((items: CartItem[]) => {
    if (!items || items.length === 0) return []
    
    console.log('🔀 Merging duplicate items...')
    const merged = new Map<string, CartItem>()
    
    items.forEach((item, idx) => {
      // CRITICAL: Proper productId extraction
      let productId: string
      
      if (item.product?._id) {
        productId = String(item.product._id)
      } else if (item.product?.id) {
        productId = String(item.product.id)
      } else if (typeof item.product === 'string') {
        productId = item.product
      } else if (item.product) {
        // Fallback: try toString but validate
        const str = String(item.product)
        if (str === '[object Object]') {
          console.error(`❌ [${idx}] Invalid product - cannot extract ID:`, item.product)
          return // Skip this invalid item
        }
        productId = str
      } else {
        console.error(`❌ [${idx}] No product found in item`)
        return // Skip
      }
      
      const variantSku = item.variantSku || 'default'
      const uniqueKey = `${productId}###${variantSku}`
      
      const existing = merged.get(uniqueKey)
      if (existing) {
        // Merge duplicate - add quantities
        console.warn('⚠️ Found duplicate cart item:', uniqueKey, 'Merging quantities')
        existing.quantity += item.quantity
      } else {
        merged.set(uniqueKey, { ...item })
      }
    })
    
    const result = Array.from(merged.values())
    console.log('📦 Cart items after merge:', result.length, 'items')
    
    // Safety check
    if (result.length === 0 && items.length > 0) {
      console.error('❌ WARNING: Merge resulted in 0 items from', items.length, 'items!')
      console.error('Raw items:', items)
      return items // Return original items to prevent data loss
    }
    
    return result
  }, [])

  // Define fetchCart before using it in useEffect
  const fetchCart = useCallback(async (token: string) => {
    if (!token) {
      setCartItems([])
      return
    }
    
    try {
      setLoading(true)
      const response = await api.get('/api/cart', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      // Backend trả về { success: true, data: { items: [...] } }
      const cartData = response.data?.data || response.data
      const rawItems = cartData?.items || []
      console.log('📥 Fetched cart from server:', rawItems.length, 'raw items')
      
      // Merge duplicates before setting state
      const mergedItems = mergeDuplicateItems(rawItems)
      setCartItems(mergedItems)
      
      // Clear guest cart after successful fetch from server
      localStorage.removeItem('guestCart')
    } catch (error: any) {
      // Silently handle auth errors - expected when not logged in
      if (error?.response?.status === 401) {
        const savedCart = localStorage.getItem('guestCart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        } else {
          setCartItems([])
        }
      } else {
        // Only log unexpected errors
        if (process.env.NODE_ENV === 'development') {
          console.error('Error fetching cart:', error)
        }
        setCartItems([])
      }
    } finally {
      setLoading(false)
    }
  }, [mergeDuplicateItems])

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'authenticated' && session?.accessToken) {
      // Add small delay to ensure session is fully hydrated
      const timer = setTimeout(() => {
        fetchCart(session.accessToken)
      }, 100)
      return () => clearTimeout(timer)
    } else if (status === 'unauthenticated') {
      // Unauthenticated or no token - use guest cart (if any)
      const savedCart = localStorage.getItem('guestCart')
      if (savedCart) {
        try {
          setCartItems(JSON.parse(savedCart))
        } catch {
          // Invalid cart data - clear it
          localStorage.removeItem('guestCart')
          setCartItems([])
        }
      } else {
        setCartItems([])
      }
    }
  }, [status, session?.accessToken, fetchCart])

  const addToCart = useCallback(async (product: any, quantity = 1, size?: string, color?: string) => {
    try {
      setLoading(true)
      
      // Only try API if authenticated
      if (status === 'authenticated' && session?.accessToken) {
        try {
          // Extract variantSku from product if it has selectedVariant
          const variantSku = product.selectedVariant?.sku || product.sku
          // Handle both MongoDB _id and regular id
          const productId = product.id || product._id
          
          if (!productId) {
            throw new Error('Product ID is missing')
          }
          
          const payload: any = {
            productId: String(productId),
            quantity,
          }
          
          // Add variantSku only if it exists
          if (variantSku) {
            payload.variantSku = String(variantSku)
          }
          
          const response = await api.post('/api/cart', payload, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
          // Backend trả về { success: true, data: { items: [...] } }
          const cartData = response.data?.data || response.data
          setCartItems(cartData?.items || [])
          // Clear guest cart after successful server update
          localStorage.removeItem('guestCart')
          return // Success - exit early
        } catch (apiError: any) {
          // If 401, fall through to guest cart
          if (apiError?.response?.status !== 401) {
            // For non-auth errors, show message and throw
            const errorMessage = apiError.response?.data?.message || apiError.message || 'Failed to add to cart'
            alert(errorMessage)
            throw apiError
          }
          // 401 error - fall through to guest cart below
        }
      }
      
      // Handle guest cart (or fallback from failed auth)
      setCartItems(prevItems => {
        const productId = String(product.id || product._id)
        const variantSku = product.selectedVariant?.sku || product.sku || 'default'
        
        // Find existing item with same product AND variant
        const existingItemIndex = prevItems.findIndex(item => {
          const itemProductId = String(item.product?.id || item.product?._id)
          const itemVariantSku = item.variantSku || 'default'
          return itemProductId === productId && itemVariantSku === variantSku
        })
        
        if (existingItemIndex > -1) {
          // Update existing item quantity
          const updatedCart = [...prevItems]
          updatedCart[existingItemIndex] = {
            ...updatedCart[existingItemIndex],
            quantity: updatedCart[existingItemIndex].quantity + quantity,
          }
          localStorage.setItem('guestCart', JSON.stringify(updatedCart))
          return updatedCart
        } else {
          // Add new item
          const newItem = {
            id: `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            product,
            quantity,
            size: size || product.selectedSize,
            color: color || product.selectedColor,
            variantSku,
          }
          const updatedCart = [...prevItems, newItem]
          localStorage.setItem('guestCart', JSON.stringify(updatedCart))
          return updatedCart
        }
      })
    } catch (error: any) {
      // Only log unexpected errors
      if (process.env.NODE_ENV === 'development' && error?.response?.status !== 401) {
        console.error('Error adding to cart:', error)
      }
      throw error
    } finally {
      setLoading(false)
    }
  }, [status, session?.accessToken])

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      console.log('🗑️ ==== REMOVE FROM CART ====')
      console.log('  itemId:', itemId)
      setLoading(true)
      
      if (session?.user && session.accessToken) {
        // itemId format: "productId###variantSku"
        const [productId, variantSku] = itemId.split('###')
        
        console.log('  Parsed:')
        console.log('    productId:', productId)
        console.log('    variantSku:', variantSku)
        
        if (!productId || !variantSku) {
          console.error('❌ Invalid itemId format:', itemId)
          throw new Error('Invalid item ID format')
        }
        
        // URL encode variantSku to handle special characters
        const encodedVariantSku = encodeURIComponent(variantSku)
        const deleteUrl = `/api/cart/${productId}/${encodedVariantSku}`
        
        console.log('  Encoded variantSku:', encodedVariantSku)
        console.log('  DELETE URL:', deleteUrl)
        console.log('  Full URL:', `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${deleteUrl}`)
        
        // Optimistic update - update UI immediately
        const previousItems = cartItems
        setCartItems(prev => {
          const filtered = prev.filter(item => {
            const pid = String(item.product?._id || item.product?.id || item.product)
            const vsku = item.variantSku || 'default'
            const compositeId = `${pid}###${vsku}`
            return compositeId !== itemId
          })
          console.log('✅ Optimistic update: removed from UI. Remaining:', filtered.length)
          return filtered
        })
        
        try {
          console.log('🌐 Making DELETE request...')
          
          const response = await api.delete(deleteUrl, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
          
          console.log('✅ Server delete successful:', response.status)
          
          // Fetch fresh data from server to ensure sync
          console.log('🔄 Fetching updated cart...')
          await fetchCart(session.accessToken)
        } catch (error: any) {
          console.error('❌ === DELETE ERROR ===')
          console.error('  Status:', error.response?.status)
          console.error('  Data:', error.response?.data)
          console.error('  Message:', error.message)
          console.error('  Full error:', error)
          // Revert on error
          setCartItems(previousItems)
          throw error
        }
        
        localStorage.removeItem('guestCart')
      } else {
        // For guest cart, filter by composite ID
        const updatedCart = cartItems.filter(item => {
          const pid = String(item.product?._id || item.product?.id || item.product)
          const vsku = item.variantSku || 'default'
          const compositeId = `${pid}###${vsku}`
          return compositeId !== itemId
        })
        setCartItems(updatedCart)
        localStorage.setItem('guestCart', JSON.stringify(updatedCart))
      }
    } catch (error: any) {
      console.error('Error removing from cart:', error)
      alert('Không thể xóa sản phẩm. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [session, cartItems, fetchCart])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      console.log('📝 ==== UPDATE QUANTITY ====')
      console.log('  itemId:', itemId)
      console.log('  quantity:', quantity)
      setLoading(true)
      
      if (session?.user && session.accessToken) {
        // itemId format: "productId###variantSku"
        const [productId, variantSku] = itemId.split('###')
        
        console.log('  Parsed:')
        console.log('    productId:', productId)
        console.log('    variantSku:', variantSku)
        
        if (!productId || !variantSku) {
          console.error('❌ Invalid itemId format:', itemId)
          throw new Error('Invalid item ID format')
        }
        
        // URL encode variantSku
        const encodedVariantSku = encodeURIComponent(variantSku)
        const updateUrl = `/api/cart/${productId}/${encodedVariantSku}`
        
        console.log('  Encoded variantSku:', encodedVariantSku)
        console.log('  PUT URL:', updateUrl)
        
        // Optimistic update
        const previousItems = cartItems
        setCartItems(prev => {
          return prev.map(item => {
            const pid = String(item.product?._id || item.product?.id || item.product)
            const vsku = item.variantSku || 'default'
            const compositeId = `${pid}###${vsku}`
            return compositeId === itemId ? { ...item, quantity } : item
          })
        })
        
        try {
          console.log('🌐 Making PUT request...')
          
          const response = await api.put(updateUrl, { quantity }, {
            headers: { Authorization: `Bearer ${session.accessToken}` }
          })
          
          console.log('✅ Server update successful:', response.status)
          // Fetch to sync with server
          await fetchCart(session.accessToken)
        } catch (error: any) {
          console.error('❌ === UPDATE ERROR ===')
          console.error('  Status:', error.response?.status)
          console.error('  Data:', error.response?.data)
          console.error('  Message:', error.message)
          // Revert on error
          setCartItems(previousItems)
          throw error
        }
        
        localStorage.removeItem('guestCart')
      } else {
        // For guest cart, match by composite ID
        const updatedCart = cartItems.map(item => {
          const pid = String(item.product?._id || item.product?.id || item.product)
          const vsku = item.variantSku || 'default'
          const compositeId = `${pid}###${vsku}`
          return compositeId === itemId ? { ...item, quantity } : item
        })
        setCartItems(updatedCart)
        localStorage.setItem('guestCart', JSON.stringify(updatedCart))
      }
    } catch (error: any) {
      console.error('Error updating cart quantity:', error)
      alert('Không thể cập nhật số lượng. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }, [session, cartItems, fetchCart])

  const clearCart = useCallback(async () => {
    try {
      setLoading(true)
      
      if (session?.user && session.accessToken) {
        // Backend uses POST, not DELETE
        await api.post('/api/cart/clear', {}, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        })
        await fetchCart(session.accessToken)
      } else {
        localStorage.removeItem('guestCart')
        setCartItems([])
      }
    } catch (error) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Error clearing cart:', error)
      }
      // Force clear on error
      localStorage.removeItem('guestCart')
      setCartItems([])
    } finally {
      setLoading(false)
    }
  }, [session, fetchCart])

  const cartCount = (cartItems || []).reduce((total, item) => total + item.quantity, 0)
  const cartTotal = (cartItems || []).reduce((total, item) => total + (item.product.price * item.quantity), 0)

  const contextValue = useMemo(() => ({
    cartItems: cartItems || [],
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal,
    loading,
  }), [cartItems, cartCount, cartTotal, loading, addToCart, removeFromCart, updateQuantity, clearCart])

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
