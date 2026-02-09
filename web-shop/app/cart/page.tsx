"use client"

import { useState, useEffect, useContext, startTransition } from 'react'
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
  size?: string
  color?: string
}

interface SellerGroup {
  sellerId: string
  sellerName: string
  items: CartItem[]
}

export default function CartPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { cartItems, removeFromCart, updateQuantity, loading: cartLoading } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showCheckoutModal, setShowCheckoutModal] = useState(false)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: session?.user?.name || '',
    phone: '',
    address: '',
    district: '',
    city: 'Hồ Chí Minh',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [notes, setNotes] = useState('')

  // Redirect admin to home - Admin không cần cart
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      startTransition(() => {
        router.push('/')
      })
    }
  }, [session, router])

  // Initialize selected items
  useEffect(() => {
    if (cartItems && cartItems.length > 0) {
      setSelectedItems(cartItems.map((item: any) => item._id))
    }
  }, [cartItems])

  // Group cart items by seller
  const groupItemsBySeller = (): SellerGroup[] => {
    if (!cartItems || cartItems.length === 0) return []
    
    const grouped: { [key: string]: SellerGroup } = {}
    
    cartItems.forEach((item: any) => {
      const sellerId = item.seller?._id || item.seller || 'unknown'
      const sellerName = item.sellerName || item.seller?.shopName || item.seller?.username || 'Unknown Shop'

      if (!grouped[sellerId]) {
        grouped[sellerId] = {
          sellerId,
          sellerName,
          items: [],
        }
      }
      grouped[sellerId].items.push(item as CartItem)
    })

    return Object.values(grouped)
  }

  // Toggle item selection
  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  // Select all items
  const toggleSelectAll = () => {
    if (!cartItems || cartItems.length === 0) return
    
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(cartItems.map((item: any) => item._id))
    }
  }

  // Calculate selected items total
  const getSelectedTotal = () => {
    if (!cartItems) return 0
    
    return cartItems
      .filter((item: any) => selectedItems.includes(item._id))
      .reduce((total: number, item: any) => {
        const price = parseFloat(item.price) || 0
        const quantity = parseInt(item.quantity) || 0
        return total + price * quantity
      }, 0)
  }

  // Calculate shipping fee
  const getShippingFee = () => {
    const total = getSelectedTotal()
    if (total >= 15000000) return 0 // Free shipping for orders >= 15M
    return 30000 // 30k shipping
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      alert(' Vui lòng đăng nhập để đặt hàng')
      startTransition(() => {
        router.push('/auth/login')
      })
      return
    }

    if (selectedItems.length === 0) {
      alert(' Vui lòng chọn ít nhất một sản phẩm')
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Import API client
      const api = (await import('@/lib/api')).default
      
      const selectedCartItems = cartItems.filter((item: any) => selectedItems.includes(item._id))

      const orderData = {
        items: selectedCartItems.map((item: any) => ({
          product: item.product?._id || item.product || item._id,
          variantSku: item.variantSku || item.sku || 'default',
          quantity: item.quantity,
        })),
        shippingAddress: {
          fullName: shippingInfo.fullName,
          phone: shippingInfo.phone,
          address: {
            street: shippingInfo.address,
            district: shippingInfo.district,
            city: shippingInfo.city,
          }
        },
        paymentMethod: paymentMethod,
        notes: notes,
      }

      await api.post('/api/orders', orderData)

      setSuccess(true)

      // Remove ordered items from cart
      for (const item of selectedCartItems) {
        if (item._id) {
          await removeFromCart(item._id)
        }
      }

      setTimeout(() => {
        startTransition(() => {
          router.push('/user/orders')
        })
      }, 2000)
    } catch (err: any) {
      console.error('Checkout error:', err)
      setError(err.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.')
    } finally {
      setLoading(false)
      setShowCheckoutModal(false)
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
  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="cart-empty-container">
        <div className="empty-cart-illustration">
          <div className="empty-cart-icon"></div>
          <h2>Giỏ hàng trống</h2>
          <p>Thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm!</p>
          <button onClick={() => {
            startTransition(() => {
              router.push('/')
            })
          }} className="btn-continue-shopping">
            Tiếp Tục Mua Sắm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page-container">
      {/* Success Modal */}
      {success && (
        <div className="success-modal-overlay">
          <div className="success-modal">
            <div className="success-icon"></div>
            <h2>Đặt hàng thành công!</h2>
            <p>Đơn hàng của bạn đang được xử lý</p>
            <div className="success-animation"></div>
          </div>
        </div>
      )}

      <div className="cart-header">
        <h1>Giỏ Hàng Của Bạn</h1>
        <div className="cart-count">{cartItems?.length || 0} sản phẩm</div>
      </div>

      <div className="cart-layout">
        {/* Left: Cart Items */}
        <div className="cart-items-section">
          {/* Select All Header */}
          <div className="cart-select-all">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={cartItems && selectedItems.length === cartItems.length && cartItems.length > 0}
                onChange={toggleSelectAll}
              />
              <span className="checkmark"></span>
              <span className="label-text">Chọn tất cả ({cartItems?.length || 0})</span>
            </label>
            {selectedItems.length > 0 && (
              <button
                onClick={() => {
                  if (window.confirm(`Xóa ${selectedItems.length} sản phẩm đã chọn?`)) {
                    selectedItems.forEach((id) => removeFromCart(id))
                    setSelectedItems([])
                  }
                }}
                className="btn-delete-selected"
              >
                <span>Xóa đã chọn</span>
              </button>
            )}
          </div>

          {/* Cart Items List - Grouped by Seller */}
          <div className="cart-items-list">
            {groupItemsBySeller().map((sellerGroup) => (
              <div key={sellerGroup.sellerId} className="seller-group">
                {/* Seller Header */}
                <div className="seller-header">
                  <div className="seller-info">
                    <h3>{sellerGroup.sellerName}</h3>
                  </div>
                  <span className="items-count">{sellerGroup.items.length} sản phẩm</span>
                </div>

                {/* Items in this shop */}
                {sellerGroup.items.map((item) => (
                  <div
                    key={item.id || item._id || `item-${item.product?.id}`}
                    className={`cart-item-card ${selectedItems.includes(item._id || item.id || '') ? 'selected' : ''}`}
                  >
                    <label className="checkbox-container">
                      <input
                        type="checkbox"
                        checked={selectedItems.includes(item._id)}
                        onChange={() => toggleItemSelection(item._id)}
                      />
                      <span className="checkmark"></span>
                    </label>

                    <div className="item-image">
                      <img 
                        src={item.imageUrl || '/images/placeholder-product.svg'} 
                        alt={item.name} 
                      />
                      {item.stock <= 5 && (
                        <div className="low-stock-badge">Chỉ còn {item.stock}</div>
                      )}
                    </div>

                    <div className="item-details">
                      <h3 className="item-name">{item.name}</h3>
                      <div className="item-meta">
                        <span className="item-brand">{item.brand}</span>
                        <span className="item-stock">Kho: {item.stock || 'N/A'}</span>
                      </div>
                      {(item.size || item.color) && (
                        <div className="item-meta">
                          {item.size && <span key="size">Size: {item.size}</span>}
                          {item.color && <span key="color">Màu: {item.color}</span>}
                        </div>
                      )}
                      <div className="item-price-section">
                        <div className="current-price">
                          {(item.price || 0).toLocaleString('vi-VN')} đ
                        </div>
                        {item.discountedPrice && (
                          <div className="original-price">
                            {item.discountedPrice.toLocaleString('vi-VN')} đ
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="item-actions">
                      <div className="quantity-controller">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="qty-btn"
                        >
                          <span>−</span>
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const val = parseInt(e.target.value) || 1
                            if (val >= 1 && val <= item.stock) {
                              updateQuantity(item._id, val)
                            }
                          }}
                          min="1"
                          max={item.stock}
                          className="qty-input"
                        />
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="qty-btn"
                        >
                          <span>+</span>
                        </button>
                      </div>

                      <div className="item-subtotal">
                        {((item.price || 0) * item.quantity).toLocaleString('vi-VN')} đ
                      </div>

                      <button
                        onClick={() => {
                          if (window.confirm('Xóa sản phẩm này khỏi giỏ hàng?')) {
                            removeFromCart(item._id)
                            setSelectedItems((prev) => prev.filter((id) => id !== item._id))
                          }
                        }}
                        className="btn-remove-item"
                        title="Xóa sản phẩm"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Right: Order Summary */}
        <div className="cart-summary-section">
          <div className="summary-card">
            <h2 className="summary-title">
              <span>Thông Tin Đơn Hàng</span>
            </h2>

            <div className="summary-details">
              <div className="summary-row">
                <span>Tạm tính ({selectedItems.length} sản phẩm)</span>
                <span className="amount">{getSelectedTotal().toLocaleString('vi-VN')} đ</span>
              </div>

              <div className="summary-row">
                <span>Phí vận chuyển</span>
                <span className={`amount ${getShippingFee() === 0 ? 'free' : ''}`}>
                  {getShippingFee() === 0
                    ? 'Miễn phí'
                    : `${getShippingFee().toLocaleString('vi-VN')} đ`}
                </span>
              </div>

              {getSelectedTotal() < 15000000 && getSelectedTotal() > 0 && (
                <div className="shipping-notice">
                  Mua thêm {(15000000 - getSelectedTotal()).toLocaleString('vi-VN')} đ để được miễn phí vận chuyển
                </div>
              )}

              <div className="summary-divider"></div>

              <div className="summary-row total-row">
                <span>Tổng cộng</span>
                <span className="total-amount">
                  {(getSelectedTotal() + getShippingFee()).toLocaleString('vi-VN')} đ
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                if (!session) {
                  startTransition(() => {
                    router.push('/auth/login')
                  })
                  return
                }
                if (selectedItems.length === 0) {
                  alert('⚠️ Vui lòng chọn sản phẩm để thanh toán')
                  return
                }
                setShowCheckoutModal(true)
              }}
              className="btn-checkout"
              disabled={selectedItems.length === 0}
            >
              <span>Thanh toán ({selectedItems.length})</span>
              <span>→</span>
            </button>

            <div className="security-badges">
              <div className="badge">
                <span>Thanh toán<br/>an toàn</span>
              </div>
              <div className="badge">
                <span>Giao hàng<br/>miễn phí</span>
              </div>
              <div className="badge">
                <span>Đổi trả<br/>dễ dàng</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {showCheckoutModal && (
        <div className="checkout-modal-overlay" onClick={() => setShowCheckoutModal(false)}>
          <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <span>Thông Tin Giao Hàng</span>
              </h2>
              <button onClick={() => setShowCheckoutModal(false)} className="btn-close-modal">
                ×
              </button>
            </div>

            {error && (
              <div className="checkout-error">
                <span></span>
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCheckout} className="checkout-form">
              <div className="form-section">
                <label className="form-label">
                  <span>Họ và tên</span>
                </label>
                <input
                  type="text"
                  placeholder="Nguyễn Văn A"
                  value={shippingInfo.fullName}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, fullName: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span>Số điện thoại</span>
                </label>
                <input
                  type="tel"
                  placeholder="0901234567"
                  value={shippingInfo.phone}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, phone: e.target.value })}
                  required
                  pattern="[0-9]{10}"
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span>Địa chỉ giao hàng</span>
                </label>
                <textarea
                  placeholder="Số nhà, tên đường, phường/xã"
                  value={shippingInfo.address}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                  required
                  rows={3}
                  className="form-textarea"
                />
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span>Quận/Huyện</span>
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Quận 1, Quận 10, Bình Thạnh..."
                  value={shippingInfo.district}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, district: e.target.value })}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span>Tỉnh/Thành phố</span>
                </label>
                <select
                  value={shippingInfo.city}
                  onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                  required
                  className="form-select"
                >
                  <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                  <option value="Hà Nội">Hà Nội</option>
                  <option value="Đà Nẵng">Đà Nẵng</option>
                  <option value="Cần Thơ">Cần Thơ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span>Phương thức thanh toán</span>
                </label>
                <div className="payment-methods">
                  <label className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <div>
                        <div className="payment-name">Thanh toán khi nhận hàng (COD)</div>
                        <div className="payment-desc">Thanh toán bằng tiền mặt khi nhận hàng</div>
                      </div>
                    </div>
                  </label>

                  <label className={`payment-option ${paymentMethod === 'bank_transfer' ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="payment"
                      value="bank_transfer"
                      checked={paymentMethod === 'bank_transfer'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <div className="payment-content">
                      <div>
                        <div className="payment-name">Chuyển khoản ngân hàng</div>
                        <div className="payment-desc">Thanh toán trước khi nhận hàng</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div className="form-section">
                <label className="form-label">
                  <span>Ghi chú (không bắt buộc)</span>
                </label>
                <textarea
                  placeholder="Ghi chú cho người bán..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="form-textarea"
                />
              </div>

              <div className="modal-summary">
                <div className="summary-item">
                  <span>Tạm tính:</span>
                  <span>{getSelectedTotal().toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="summary-item">
                  <span>Phí vận chuyển:</span>
                  <span>{getShippingFee().toLocaleString('vi-VN')} đ</span>
                </div>
                <div className="summary-item total">
                  <span>Tổng thanh toán:</span>
                  <span className="total-price">
                    {(getSelectedTotal() + getShippingFee()).toLocaleString('vi-VN')} đ
                  </span>
                </div>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowCheckoutModal(false)}
                  className="btn-cancel"
                  disabled={loading}
                >
                  Hủy
                </button>
                <button type="submit" className="btn-submit-order" disabled={loading}>
                  {loading ? (
                    <>
                      <span className="spinner-icon"></span>
                      <span>Đang xử lý...</span>
                    </>
                  ) : (
                    <>
                      <span>Đặt Hàng</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
