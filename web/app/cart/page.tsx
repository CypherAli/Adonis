"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'
import { FaShoppingCart, FaTimes } from 'react-icons/fa'
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
  const { data: session } = useSession()
  const { cartItems, removeFromCart, updateQuantity, clearCart, loading: cartLoading } = useCart()
  
  // Optimistic updates state
  const [optimisticItems, setOptimisticItems] = useState<CartItem[]>([])
  const quantityTimers = useRef<{ [key: string]: NodeJS.Timeout }>({})

  // Normalize and merge duplicate cart items
  const normalizeCartItems = useCallback((): CartItem[] => {
    if (!cartItems || cartItems.length === 0) return []

    const resolvePrice = (item: any, product: any, variantSku: string): number => {
      if (item.price) return item.price
      if (product?.variants && variantSku !== 'default') {
        const variant = product.variants.find((v: any) => v.sku === variantSku)
        if (variant?.price) return variant.price
      }
      return product?.basePrice || 0
    }

    // First pass: normalize all items
    const normalized = cartItems.map((item: any) => {
      const isPopulated = item.product && typeof item.product === 'object'
      const product = isPopulated ? item.product : null
      const productId = isPopulated
        ? String(product._id || product.id)
        : String(item.product)
      const variantSku = item.variantSku || 'default'

      return {
        _id: `${productId}###${variantSku}`,
        id: item.id,
        product,
        productId,
        variantSku,
        seller: item.seller,
        sellerName: item.sellerName || item.seller?.shopName || product?.createdBy?.shopName || 'Unknown Shop',
        name: product?.name || item.name || 'Unknown Product',
        brand: product?.brand || item.brand || '',
        price: resolvePrice(item, product, variantSku),
        quantity: item.quantity || 1,
        stock: product?.stock || item.stock || 99,
        imageUrl: product?.images?.[0] || item.imageUrl || '/images/placeholder-product.svg',
        discountedPrice: product?.discountedPrice || item.discountedPrice,
      }
    })

    // Second pass: merge duplicates (defensive)
    const merged = new Map<string, CartItem>()
    normalized.forEach((item) => {
      if (item._id.includes('undefined') || item._id.includes('[object Object]')) return

      const existing = merged.get(item._id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        merged.set(item._id, item)
      }
    })

    return Array.from(merged.values())
  }, [cartItems])

  // Update optimistic items when cart changes
  useEffect(() => {
    setOptimisticItems(normalizeCartItems())
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
      } catch {
        setOptimisticItems(normalizeCartItems())
      }
      delete quantityTimers.current[itemId]
    }, 600) // 600ms debounce
  }, [updateQuantity, normalizeCartItems])

  // Handle remove item with optimistic update
  const handleRemoveItem = useCallback(async (itemId: string) => {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) return

    setOptimisticItems(prev => prev.filter(item => item._id !== itemId))

    try {
      await removeFromCart(itemId)
    } catch {
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
    } catch {
      setOptimisticItems(previousItems)
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
