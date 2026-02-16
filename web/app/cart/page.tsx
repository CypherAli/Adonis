"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'
import { FaTrash, FaShoppingCart, FaTimes } from 'react-icons/fa'
import './cart.css'

interface CartItem {
  _id: string
  id?: string
  product?: any
  productId?: string
  variantSku?: string
  seller?: any
  sellerName?: string
  name: string
  brand: string
  price: number
  quantity: number
  stock: number
  imageUrl?: string
  discountedPrice?: number
}

export default function CartPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading: cartLoading } = useCart()
  
  // Optimistic updates state
  const [optimisticItems, setOptimisticItems] = useState<CartItem[]>([])
  const quantityTimers = useRef<{ [key: string]: NodeJS.Timeout }>({})

  // Normalize and merge duplicate cart items
  const normalizeCartItems = useCallback((): CartItem[] => {
    if (!cartItems || cartItems.length === 0) return []
    
    console.log('🔄 Normalizing cart items. Raw count:', cartItems.length)
    
    // First pass: normalize all items
    const normalized = cartItems.map((item: any, idx) => {
      console.log(`  [${idx}] Raw item:`, item)
      
      // Extract productId - handle both populated object and ObjectId string
      let productId: string
      let product: any
      
      if (item.product && typeof item.product === 'object') {
        // Product is populated
        product = item.product
        productId = String(product._id || product.id)
        console.log(`    ✅ Product populated: ${productId} - ${product.name}`)
      } else {
        // Product is ObjectId string
        productId = String(item.product)
        product = null
        console.warn(`    ⚠️ Product NOT populated! Only ID: ${productId}`)
      }
      
      // Use item.variantSku from backend, fallback to 'default'
      const variantSku = item.variantSku || 'default'
      // Use ### as separator to avoid conflicts with ObjectId
      const uniqueId = `${productId}###${variantSku}`
      
      const normalized = {
        _id: uniqueId,
        id: item.id,
        product: product,
        productId,
        variantSku,
        seller: item.seller,
        sellerName: item.sellerName || item.seller?.shopName || product?.createdBy?.shopName || 'Unknown Shop',
        name: product?.name || item.name || 'Unknown Product',
        brand: product?.brand || item.brand || '',
        price: item.price || (() => {
          // Try to get price from matching variant
          if (product?.variants && variantSku !== 'default') {
            const variant = product.variants.find((v: any) => v.sku === variantSku)
            if (variant?.price) return variant.price
          }
          return product?.basePrice || 0
        })(),
        quantity: item.quantity || 1,
        stock: product?.stock || item.stock || 99,
        imageUrl: product?.images?.[0] || item.imageUrl || '/images/placeholder-product.svg',
        discountedPrice: product?.discountedPrice || item.discountedPrice,
      }
      
      console.log(`    → Normalized: ${normalized.name} (${normalized._id})`)
      return normalized
    })
    
    // Second pass: merge duplicates (defensive measure)
    const merged = new Map<string, CartItem>()
    normalized.forEach((item, idx) => {
      // Validate uniqueId is not invalid
      if (item._id.includes('undefined') || item._id.includes('[object Object]')) {
        console.error(`❌ [${idx}] Invalid uniqueId detected: ${item._id}`)
        console.error('  Item:', item)
        return // Skip invalid item
      }
      
      const existing = merged.get(item._id)
      if (existing) {
        // Merge quantities of duplicate items
        console.warn(`⚠️ Merging duplicate: ${item._id}`)
        existing.quantity += item.quantity
      } else {
        merged.set(item._id, item)
      }
    })
    
    const result = Array.from(merged.values())
    console.log('✅ Final normalized items:', result.length)
    
    // Safety check
    if (result.length === 0 && cartItems.length > 0) {
      console.error('❌ CRITICAL: Normalization resulted in 0 items!')
      console.error('Raw cartItems:', cartItems)
    }
    
    return result
  }, [cartItems])

  // Update optimistic items when cart changes
  useEffect(() => {
    const normalized = normalizeCartItems()
    console.log('🔄 Cart updated. Items:', normalized.length)
    normalized.forEach((item, idx) => {
      console.log(`  [${idx}] ID: ${item._id}, Product: ${item.name}, Qty: ${item.quantity}`)
    })
    setOptimisticItems(normalized)
  }, [normalizeCartItems])

  const items = optimisticItems

  // Calculate totals
  const calculateTotals = () => {
    if (items.length === 0) {
      return { subtotal: 0, shippingFee: 0, total: 0 }
    }

    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shippingFee = subtotal > 500000 ? 0 : 30000
    const total = subtotal + shippingFee

    return { subtotal, shippingFee, total }
  }

  const { subtotal, shippingFee, total } = calculateTotals()

  // Handle quantity change with debouncing and optimistic update
  const handleQuantityChange = useCallback((itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    
    // Optimistic update - instant UI feedback
    setOptimisticItems(prev => 
      prev.map(item => 
        item._id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
    
    // Clear existing timer for this item
    if (quantityTimers.current[itemId]) {
      clearTimeout(quantityTimers.current[itemId])
    }
    
    // Debounce API call - only call after user stops changing quantity
    quantityTimers.current[itemId] = setTimeout(async () => {
      try {
        await updateQuantity(itemId, newQuantity)
      } catch (error) {
        // Revert optimistic update on error
        setOptimisticItems(normalizeCartItems())
        console.error('Failed to update quantity:', error)
      }
      delete quantityTimers.current[itemId]
    }, 600) // 600ms debounce
  }, [updateQuantity, normalizeCartItems])

  // Handle remove item with optimistic update
  const handleRemoveItem = useCallback(async (itemId: string) => {
    console.log('🗑️ User clicked remove for item:', itemId)
    
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      console.log('❌ User cancelled remove')
      return
    }
    
    console.log('✅ User confirmed remove, proceeding...')
    
    // Optimistic update - instant UI feedback
    setOptimisticItems(prev => {
      const filtered = prev.filter(item => item._id !== itemId)
      console.log('📉 Optimistically removed. New count:', filtered.length)
      return filtered
    })
    
    try {
      console.log('📡 Calling removeFromCart API...')
      await removeFromCart(itemId)
      console.log('✅ Remove successful!')
    } catch (error) {
      console.error('❌ Remove failed:', error)
      // Revert optimistic update on error
      setOptimisticItems(normalizeCartItems())
      alert('Không thể xóa sản phẩm. Vui lòng thử lại.')
    }
  }, [removeFromCart, normalizeCartItems])

  // Handle clear all items with optimistic update
  const handleClearAll = useCallback(async () => {
    if (!confirm('Bạn có chắc muốn xóa tất cả sản phẩm khỏi giỏ hàng?')) return
    
    // Store current items for potential revert
    const previousItems = optimisticItems
    
    // Optimistic update - instant UI feedback
    setOptimisticItems([])
    
    try {
      await clearCart()
    } catch (error) {
      // Revert optimistic update on error
      setOptimisticItems(previousItems)
      console.error('Failed to clear cart:', error)
      alert('Không thể xóa giỏ hàng. Vui lòng thử lại.')
    }
  }, [clearCart, optimisticItems])
  
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(quantityTimers.current).forEach(timer => clearTimeout(timer))
    }
  }, [])

  // Loading state
  if (cartLoading) {
    return (
      <div className="cart-empty-container">
        <div className="empty-cart-illustration">
          <div className="spinner"></div>
          <h2>Đang tải giỏ hàng...</h2>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (items.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="empty-cart-illustration">
          <div className="empty-cart-icon">🛒</div>
          <h2>Giỏ hàng trống</h2>
          <p>Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
          <Link href="/" className="btn-continue-shopping">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-container">
      <div className="cart-container">
        {/* Enhanced Header */}
        <div className="cart-header">
          <div className="cart-header-left">
            <FaShoppingCart className="cart-header-icon" />
            <h1>Giỏ Hàng</h1>
            <span className="cart-count">{items.length} sản phẩm</span>
            {process.env.NODE_ENV === 'development' && (
              <button 
                onClick={() => {
                  console.log('🐛 === DEBUG CART INFO ===')
                  console.log('Raw cartItems from provider:', cartItems)
                  console.log('cartItems length:', cartItems?.length)
                  console.log('Normalized items:', items)
                  console.log('Normalized items length:', items.length)
                  items.forEach((item, idx) => {
                    console.log(`[${idx}] ${item._id} | ${item.name} | Qty: ${item.quantity}`)
                  })
                  console.log('======================')
                }}
                style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '12px', background: '#ff6b6b', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
              >
                🐛 Debug
              </button>
            )}
          </div>
          {items.length > 0 && (
            <button 
              onClick={handleClearAll}
              className="btn-clear-all"
              title="Xóa tất cả sản phẩm"
            >
              <FaTimes className="icon" />
              Xóa tất cả
            </button>
          )}
        </div>

        <div className="cart-content">
          {/* Left: Cart Items */}
          <div className="cart-items-section">
            {items.map((item) => (
              <div key={item._id} className="cart-item">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="item-image"
                />
                
                <div className="item-details">
                  <h3 className="item-name">{item.name}</h3>
                  <p className="item-brand">{item.brand}</p>
                  <p className="item-seller">Bán bởi: {item.sellerName}</p>
                  
                  <div className="item-price">
                    {item.discountedPrice && item.discountedPrice < item.price ? (
                      <>
                        <span className="original-price">{item.price.toLocaleString('vi-VN')}đ</span>
                        <span className="discounted-price">{item.discountedPrice.toLocaleString('vi-VN')}đ</span>
                      </>
                    ) : (
                      <span className="current-price">{item.price.toLocaleString('vi-VN')}đ</span>
                    )}
                  </div>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value) || 1)}
                      min="1"
                      max={item.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>

                  <div className="item-subtotal">
                    {((item.discountedPrice || item.price) * item.quantity).toLocaleString('vi-VN')}đ
                  </div>

                  <button
                    className="btn-remove"
                    onClick={() => handleRemoveItem(item._id)}
                    title="Xóa khỏi giỏ hàng"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Order Summary */}
          <div className="cart-summary">
            <h2>Tóm tắt đơn hàng</h2>
            
            <div className="summary-row">
              <span>Tạm tính:</span>
              <span>{subtotal.toLocaleString('vi-VN')}đ</span>
            </div>

            <div className="summary-row">
              <span>Phí vận chuyển:</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="free-shipping">Miễn phí</span>
                ) : (
                  `${shippingFee.toLocaleString('vi-VN')}đ`
                )}
              </span>
            </div>

            {shippingFee === 0 && subtotal > 0 && (
              <div className="shipping-note success">
                ✅ Bạn được miễn phí vận chuyển!
              </div>
            )}

            {subtotal > 0 && subtotal < 500000 && (
              <div className="shipping-note">
                Mua thêm {(500000 - subtotal).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển
              </div>
            )}

            <div className="summary-divider"></div>

            <div className="summary-row total">
              <span>Tổng cộng:</span>
              <span className="total-amount">{total.toLocaleString('vi-VN')}đ</span>
            </div>

            {session ? (
              <Link href="/checkout" className="btn-checkout">
                Tiến hành thanh toán
              </Link>
            ) : (
              <Link href="/auth/login?redirect=/checkout" className="btn-checkout">
                Đăng nhập để thanh toán
              </Link>
            )}

            <Link href="/" className="btn-continue-shopping">
              ← Tiếp tục mua sắm
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
