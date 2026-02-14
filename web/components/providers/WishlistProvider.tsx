"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback, useRef } from 'react'
import api from '@/lib/api'
import { useSession } from 'next-auth/react'

interface WishlistItem {
  id: string
  product: any
}

interface WishlistContextType {
  wishlist: any[]
  wishlistItems: WishlistItem[]
  addToWishlist: (product: any) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  clearWishlist: () => Promise<void>
  toggleWishlist: (product: any) => Promise<void>
  isInWishlist: (productId: string) => boolean
  wishlistCount: number
  loading: boolean
  loadingIds: Set<string>
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set())
  
  // Use ref to always have fresh wishlistItems in callbacks
  const wishlistItemsRef = useRef<WishlistItem[]>([])
  wishlistItemsRef.current = wishlistItems

  // Fetch wishlist from server
  const fetchWishlist = useCallback(async (token: string) => {
    if (!token) {
      setWishlistItems([])
      return
    }
    
    try {
      const response = await api.get('/api/user/wishlist', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = response.data || []
      // Kiểm tra data có phải array không
      if (Array.isArray(data)) {
        const items = data.map((item: any, index: number) => ({
          id: String(item.product?._id || item._id || `item-${index}`),
          product: item.product || item,
        }))
        setWishlistItems(items)
      } else {
        setWishlistItems([])
      }
    } catch (error: any) {
      // Nếu 401 hoặc 404 thì chỉ set empty, không log error
      if (error?.response?.status === 401 || error?.response?.status === 404) {
        setWishlistItems([])
      } else {
        console.error('Error fetching wishlist:', error)
        setWishlistItems([])
      }
    }
  }, [])

  // Load wishlist on auth change
  useEffect(() => {
    if (status === 'loading') return
    
    if (status === 'authenticated' && session?.accessToken) {
      fetchWishlist(session.accessToken)
    } else if (status === 'unauthenticated') {
      // Load from localStorage for guests
      try {
        const saved = localStorage.getItem('guestWishlist')
        if (saved) setWishlistItems(JSON.parse(saved))
      } catch {
        setWishlistItems([])
      }
    }
  }, [status, session?.accessToken, fetchWishlist])

  // Check if product is in wishlist - use ref for fresh value
  const isInWishlist = useCallback((productId: string): boolean => {
    const pid = String(productId)
    return wishlistItemsRef.current.some(item => {
      const itemId = String(item.product?._id || item.product?.id || item.id)
      return itemId === pid
    })
  }, []) // No dependencies - uses ref

  // Add to wishlist with optimistic update
  const addToWishlist = useCallback(async (product: any) => {
    const productId = String(product._id || product.id)
    
    // Prevent duplicate calls
    if (loadingIds.has(productId)) return
    
    // Check if already in wishlist using ref
    if (isInWishlist(productId)) return
    
    // Optimistic update
    const newItem = { id: productId, product }
    setWishlistItems(prev => [...prev, newItem])
    setLoadingIds(prev => new Set(prev).add(productId))
    
    if (session?.accessToken) {
      setLoading(true)
      try {
        await api.post('/api/user/wishlist', 
          { productId },
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        )
        // Fetch fresh data after success
        await fetchWishlist(session.accessToken)
      } catch (error) {
        // Revert optimistic update on error
        console.error('Error adding to wishlist:', error)
        setWishlistItems(prev => prev.filter(item => item.id !== productId))
      } finally {
        setLoading(false)
        setLoadingIds(prev => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
      }
    } else {
      // Guest mode - already updated optimistically
      localStorage.setItem('guestWishlist', JSON.stringify(wishlistItemsRef.current))
      setLoadingIds(prev => {
        const next = new Set(prev)
        next.delete(productId)
        return next
      })
    }
  }, [session?.accessToken, fetchWishlist, isInWishlist, loadingIds])

  // Remove from wishlist with optimistic update
  const removeFromWishlist = useCallback(async (productId: string) => {
    const pid = String(productId)
    
    // Prevent duplicate calls
    if (loadingIds.has(pid)) return
    
    // Store old items for rollback
    const oldItems = [...wishlistItemsRef.current]
    
    // Optimistic update
    setWishlistItems(prev => prev.filter(item => {
      const itemId = String(item.product?._id || item.product?.id || item.id)
      return itemId !== pid
    }))
    setLoadingIds(prev => new Set(prev).add(pid))
    
    if (session?.accessToken) {
      setLoading(true)
      try {
        await api.delete(`/api/user/wishlist/${pid}`, {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        })
        // Fetch fresh data after success
        await fetchWishlist(session.accessToken)
      } catch (error) {
        // Revert optimistic update on error
        console.error('Error removing from wishlist:', error)
        setWishlistItems(oldItems)
      } finally {
        setLoading(false)
        setLoadingIds(prev => {
          const next = new Set(prev)
          next.delete(pid)
          return next
        })
      }
    } else {
      // Guest mode
      localStorage.setItem('guestWishlist', JSON.stringify(wishlistItemsRef.current))
      setLoadingIds(prev => {
        const next = new Set(prev)
        next.delete(pid)
        return next
      })
    }
  }, [session?.accessToken, fetchWishlist, loadingIds])

  // Toggle wishlist - uses ref for fresh check
  const toggleWishlist = useCallback(async (product: any) => {
    const productId = String(product._id || product.id)
    
    // Use ref to get fresh value at moment of click
    const inWishlist = isInWishlist(productId)
    
    if (inWishlist) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(product)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  // Clear wishlist
  const clearWishlist = useCallback(async () => {
    if (session?.accessToken) {
      setLoading(true)
      try {
        await api.delete('/api/user/wishlist/clear/all', {
          headers: { Authorization: `Bearer ${session.accessToken}` }
        })
        setWishlistItems([])
      } finally {
        setLoading(false)
      }
    } else {
      setWishlistItems([])
      localStorage.removeItem('guestWishlist')
    }
  }, [session?.accessToken])

  const wishlistCount = wishlistItems.length
  const wishlist = useMemo(() => wishlistItems.map(item => item.product || item), [wishlistItems])

  const contextValue = useMemo(() => ({
    wishlist,
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    toggleWishlist,
    isInWishlist,
    wishlistCount,
    loading,
    loadingIds,
  }), [wishlist, wishlistItems, addToWishlist, removeFromWishlist, clearWishlist, toggleWishlist, isInWishlist, wishlistCount, loading, loadingIds])

  return (
    <WishlistContext.Provider value={contextValue}>
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
