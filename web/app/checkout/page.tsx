"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useCart } from '@/components/providers/CartProvider'
import api from '@/lib/api'
import './checkout.css'

interface CheckoutItem {
  _id: string
  productId: string
  variantSku: string
  name: string
  brand: string
  price: number
  quantity: number
  imageUrl?: string
}

export default function CheckoutPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { cartItems, refreshCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [tempOrderCode, setTempOrderCode] = useState('')

  const [shippingInfo, setShippingInfo] = useState({
    fullName: session?.user?.name || '',
    phone: '',
    street: '',
    district: '',
    city: 'Hồ Chí Minh',
    ward: '',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [notes, setNotes] = useState('')

  // Generate temp order code for bank transfer QR
  useEffect(() => {
    if (!tempOrderCode) {
      setTempOrderCode(`DH${Date.now().toString().slice(-8)}`)
    }
  }, [tempOrderCode])

  // Redirect if not logged in
  useEffect(() => {
    if (!session) {
      router.push('/auth/login?redirect=/checkout')
    }
  }, [session, router])

  // Redirect if cart is empty
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      router.push('/cart')
    }
  }, [cartItems, router])

  // Calculate totals
  const calculateTotals = () => {
    if (!cartItems || cartItems.length === 0) {
      return { subtotal: 0, shippingFee: 0, total: 0 }
    }

    const subtotal = cartItems.reduce(
      (sum: number, item: any) => {
        let price = item.price || 0
        if (!price && item.product?.variants && item.variantSku && item.variantSku !== 'default') {
          const variant = item.product.variants.find((v: any) => v.sku === item.variantSku)
          if (variant?.price) price = variant.price
        }
        if (!price) price = item.product?.basePrice || item.product?.price || 0
        return sum + price * item.quantity
      },
      0
    )
    const shippingFee = subtotal > 500000 ? 0 : 30000
    const total = subtotal + shippingFee

    return { subtotal, shippingFee, total }
  }

  const { subtotal, shippingFee, total } = calculateTotals()

  // Handle checkout
  const handleCheckout = async () => {
    if (!shippingInfo.fullName || !shippingInfo.phone || !shippingInfo.street || !shippingInfo.district) {
      setError('Vui lòng điền đầy đủ thông tin giao hàng')
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Prepare order data - validate each item
      const orderItems = cartItems.map((item: any) => {
        const productId = item.product?._id || item.product?.id || (typeof item.product === 'string' ? item.product : item.productId)
        const variantSku = item.variantSku || 'default'
        // Extract price: item.price > variant price > base price
        let price = item.price || 0
        if (!price && item.product?.variants && variantSku !== 'default') {
          const variant = item.product.variants.find((v: any) => v.sku === variantSku)
          if (variant?.price) price = variant.price
        }
        if (!price) price = item.product?.basePrice || item.product?.price || 0
        return {
          productId: productId ? String(productId) : null,
          variantSku: item.variantSku || 'default',
          quantity: item.quantity,
          price,
        }
      })

      // Validate: no items with missing productId or 0 price
      const invalidItems = orderItems.filter(i => !i.productId || i.price <= 0)
      if (invalidItems.length > 0) {
        console.error('❌ Invalid order items:', invalidItems)
        setError('Giỏ hàng có sản phẩm không hợp lệ. Vui lòng xóa và thêm lại sản phẩm.')
        setLoading(false)
        return
      }

      const orderData = {
        items: orderItems,
        shippingAddress: shippingInfo,
        paymentMethod,
        notes,
      }

      // Create order - backend auto-clears cart & decreases stock
      await api.post('/api/orders', orderData)

      // Refresh frontend cart state (backend already cleared it)
      await refreshCart()

      setSuccess(true)

      setTimeout(() => {
        router.push('/user/orders')
      }, 2000)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.response?.data?.message || 'Đã có lỗi xảy ra khi đặt hàng')
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div className="container">Đang chuyển hướng...</div>
  }

  if (!cartItems || cartItems.length === 0) {
    return <div className="container">Giỏ hàng trống</div>
  }

  if (success) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="checkout-success">
            <div className="success-icon">✅</div>
            <h2>Đặt hàng thành công!</h2>
            <p>Đơn hàng của bạn đã được ghi nhận. Chúng tôi sẽ liên hệ với bạn sớm nhất.</p>
            <Link href="/user/orders" className="btn-view-orders">
              Xem đơn hàng
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Thanh Toán</h1>

        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="checkout-grid">
          {/* Left: Shipping & Payment Info */}
          <div className="checkout-form">
            <div className="form-section">
              <h2>Thông tin giao hàng</h2>
              
              <div className="form-group">
                <label>Họ và tên *</label>
                <input
                  type="text"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Số điện thoại *</label>
                <input
                  type="tel"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ *</label>
                <input
                  type="text"
                  value={shippingInfo.street}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, street: e.target.value })}
                  placeholder="Số nhà, tên đường"
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Phường/Xã</label>
                  <input
                    type="text"
                    value={shippingInfo.ward}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, ward: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Quận/Huyện *</label>
                  <input
                    type="text"
                    value={shippingInfo.district}
                    onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Tỉnh/Thành phố *</label>
                <input
                  type="text"
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Ghi chú</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ghi chú thêm về đơn hàng (tùy chọn)"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-section">
              <h2>Phương thức thanh toán</h2>
              
              <div className="payment-methods">
                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💵 Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="bank_transfer"
                    checked={paymentMethod === 'bank_transfer'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>🏦 Chuyển khoản ngân hàng</span>
                </label>

                <label className="payment-option">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span>💳 Thẻ tín dụng/ghi nợ</span>
                </label>
              </div>

              {/* VietQR Bank Transfer Section */}
              {paymentMethod === 'bank_transfer' && tempOrderCode && total > 0 && (
                <div className="bank-transfer-qr-section">
                  <div className="qr-header">
                    <h4>Thông tin chuyển khoản</h4>
                    <p>Quét mã QR bên dưới để thanh toán</p>
                  </div>
                  <div className="qr-code-container">
                    <img
                      src={`https://img.vietqr.io/image/SHB-0848565650-compact.png?amount=${total}&addInfo=${encodeURIComponent(`${tempOrderCode} ${shippingInfo.fullName || 'Khach hang'}`)}`}
                      alt="VietQR Payment Code"
                      className="qr-code-image"
                    />
                  </div>
                  <div className="bank-info">
                    <div className="bank-info-row">
                      <span>Ngân hàng:</span>
                      <strong>SHB - Sài Gòn Hà Nội</strong>
                    </div>
                    <div className="bank-info-row">
                      <span>Số tài khoản:</span>
                      <strong>0848565650</strong>
                    </div>
                    <div className="bank-info-row">
                      <span>Số tiền:</span>
                      <strong>{total.toLocaleString('vi-VN')}đ</strong>
                    </div>
                    <div className="bank-info-row">
                      <span>Nội dung CK:</span>
                      <strong>{tempOrderCode} {shippingInfo.fullName || 'Khach hang'}</strong>
                    </div>
                  </div>
                  <div className="qr-note">
                    ⚠️ Vui lòng chuyển khoản đúng số tiền và nội dung để đơn hàng được xử lý nhanh nhất.
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Order Summary */}
          <div className="order-summary">
            <h2>Đơn hàng của bạn</h2>
            
            <div className="order-items">
              {cartItems.map((item: any, index: number) => {
                const productName = item.name || item.product?.name || 'Sản phẩm'
                const imageUrl = item.imageUrl || item.product?.images?.[0] || '/images/placeholder.png'
                const price = item.price || item.product?.basePrice || item.product?.price || 0
                const productId = item.product?._id || item.product?.id || item.productId
                const key = `${productId}-${item.variantSku || 'default'}-${index}`
                return (
                  <div key={key} className="order-item">
                    <img src={imageUrl} alt={productName} />
                    <div className="item-info">
                      <h4>{productName}</h4>
                      <p>SL: {item.quantity}</p>
                    </div>
                    <div className="item-price">
                      {(price * item.quantity).toLocaleString('vi-VN')}đ
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Tạm tính:</span>
                <span>{subtotal.toLocaleString('vi-VN')}đ</span>
              </div>
              <div className="total-row">
                <span>Phí vận chuyển:</span>
                <span>{shippingFee === 0 ? 'Miễn phí' : `${shippingFee.toLocaleString('vi-VN')}đ`}</span>
              </div>
              <div className="total-row total-final">
                <span>Tổng cộng:</span>
                <span>{total.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>

            {shippingFee === 0 && subtotal > 0 && (
              <div className="free-shipping-notice">
                ✅ Bạn được miễn phí vận chuyển!
              </div>
            )}

            {subtotal > 0 && subtotal < 500000 && (
              <div className="shipping-notice">
                Mua thêm {(500000 - subtotal).toLocaleString('vi-VN')}đ để được miễn phí vận chuyển
              </div>
            )}

            <button
              className="btn-checkout"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : 'Hoàn tất đặt hàng'}
            </button>

            <Link href="/cart" className="btn-back-to-cart">
              ← Quay lại giỏ hàng
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
