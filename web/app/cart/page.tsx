"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'
import './cart.css'

interface CartItem {
  _id: string
  id?: string
  product?: any
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
  const { cartItems, removeFromCart, updateQuantity, loading: cartLoading } = useCart()

  // Normalize cart items
  const normalizeCartItems = (): CartItem[] => {
    if (!cartItems || cartItems.length === 0) return []
    
    return cartItems.map((item: any) => {
      const isGuestCart = item.product && typeof item.product === 'object' && item.product.name
      
      if (isGuestCart) {
        const product = item.product
        return {
          _id: item.id || item._id || `guest-${Date.now()}`,
          id: item.id,
          product: product,
          seller: product.seller || product.createdBy,
          sellerName: product.sellerName || product.seller?.shopName || 'Unknown Shop',
          name: product.name || 'Unknown Product',
          brand: product.brand || '',
          price: product.price || product.basePrice || 0,
          quantity: item.quantity || 1,
          stock: product.stock || 99,
          imageUrl: product.imageUrl || product.images?.[0] || '/images/placeholder-product.svg',
          discountedPrice: product.discountedPrice,
        }
      } else {
        return {
          _id: item._id,
          id: item.id,
          product: item.product,
          seller: item.seller,
          sellerName: item.sellerName || item.seller?.shopName || 'Unknown Shop',
          name: item.name || item.product?.name || 'Unknown Product',
          brand: item.brand || item.product?.brand || '',
          price: item.price || item.product?.basePrice || 0,
          quantity: item.quantity || 1,
          stock: item.stock || 99,
          imageUrl: item.imageUrl || item.product?.images?.[0] || '/images/placeholder-product.svg',
          discountedPrice: item.discountedPrice,
        }
      }
    })
  }

  const items = normalizeCartItems()

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

  // Handle quantity change
  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    await updateQuantity(itemId, newQuantity)
  }

  // Handle remove item
  const handleRemoveItem = async (itemId: string) => {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi giỏ hàng?')) {
      await removeFromCart(itemId)
    }
  }

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
        <h1>Giỏ Hàng ({items.length} sản phẩm)</h1>

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
