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

  // Define fetchCart before using it in useEffect
  const fetchCart = useCallback(async (token: string) => {
    if (!token) {
      console.warn('No token provided for fetchCart')
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
      setCartItems(cartData?.items || [])
    } catch (error: any) {
      // Nếu 401 Unauthorized hoặc chưa login thì dùng guest cart
      if (error?.response?.status === 401) {
        const savedCart = localStorage.getItem('guestCart')
        if (savedCart) {
          setCartItems(JSON.parse(savedCart))
        } else {
          setCartItems([])
        }
      } else {
        console.error('Error fetching cart:', error)
        setCartItems([])
      }
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'authenticated' && session?.accessToken) {
      fetchCart(session.accessToken)
    } else {
      // Unauthenticated or no token - use guest cart
      const savedCart = localStorage.getItem('guestCart')
      if (savedCart) {
        setCartItems(JSON.parse(savedCart))
      } else {
        setCartItems([])
      }
    }
  }, [status, session?.accessToken, fetchCart])

  const addToCart = useCallback(async (product: any, quantity = 1, size?: string, color?: string) => {
    try {
      setLoading(true)
      
      if (session?.user) {
        // Extract variantSku from product if it has selectedVariant
        const variantSku = product.selectedVariant?.sku || product.sku || undefined
        // Handle both MongoDB _id and regular id
        const productId = product.id || product._id
        
        if (!productId) {
          throw new Error('Product ID is missing')
        }
        
        // Only send variantSku if it exists
        const payload: any = {
          productId: String(productId),
          quantity,
        }
        
        if (variantSku) {
          payload.variantSku = variantSku
        }
        
        const response = await api.post('/api/cart', payload)
        // Backend trả về { success: true, data: { items: [...] } }
        const cartData = response.data?.data || response.data
        setCartItems(cartData?.items || [])
      } else {
        // Handle guest cart - check if item exists and update quantity
        setCartItems(prevItems => {
          const productId = product.id || product._id
          const existingItemIndex = prevItems.findIndex(item => {
            const itemProductId = item.product?.id || item.product?._id
            return itemProductId === productId
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
              id: `guest-${Date.now()}`,
              product,
              quantity,
              size: size || product.selectedSize,
              color: color || product.selectedColor,
              variantSku: product.selectedVariant?.sku,
            }
            const updatedCart = [...prevItems, newItem]
            localStorage.setItem('guestCart', JSON.stringify(updatedCart))
            return updatedCart
          }
        })
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to add to cart'
      alert(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  }, [session, cartItems])

  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setLoading(true)
      
      if (session?.user && session.accessToken) {
        await api.delete(`/api/cart/${itemId}`)
        await fetchCart(session.accessToken)
      } else {
        const updatedCart = cartItems.filter(item => (item.id || item._id) !== itemId)
        setCartItems(updatedCart)
        localStorage.setItem('guestCart', JSON.stringify(updatedCart))
      }
    } catch (error) {
      console.error('Error removing from cart:', error)
    } finally {
      setLoading(false)
    }
  }, [session, cartItems, fetchCart])

  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setLoading(true)
      
      if (session?.user && session.accessToken) {
        await api.put(`/api/cart/${itemId}`, { quantity })
        await fetchCart(session.accessToken)
      } else {
        const updatedCart = cartItems.map(item =>
          (item.id || item._id) === itemId ? { ...item, quantity } : item
        )
        setCartItems(updatedCart)
        localStorage.setItem('guestCart', JSON.stringify(updatedCart))
      }
    } catch (error) {
      console.error('Error updating cart quantity:', error)
    } finally {
      setLoading(false)
    }
  }, [session, cartItems, fetchCart])

  const clearCart = useCallback(async () => {
    try {
      setLoading(true)
      
      if (session?.user) {
        await api.delete('/api/cart/clear')
      } else {
        localStorage.removeItem('guestCart')
      }
      setCartItems([])
    } catch (error) {
      console.error('Error clearing cart:', error)
    } finally {
      setLoading(false)
    }
  }, [session])

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
