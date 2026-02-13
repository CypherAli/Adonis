"use client"

import { useState, FormEvent } from 'react'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: CheckoutData) => Promise<void>
  selectedTotal: number
  shippingFee: number
  selectedCount: number
  loading: boolean
  error: string | null
  userName?: string
}

export interface CheckoutData {
  shippingInfo: {
    fullName: string
    phone: string
    address: string
    city: string
  }
  paymentMethod: string
  notes: string
}

export default function CheckoutModal({
  isOpen,
  onClose,
  onSubmit,
  selectedTotal,
  shippingFee,
  selectedCount,
  loading,
  error,
  userName = '',
}: CheckoutModalProps) {
  const [shippingInfo, setShippingInfo] = useState({
    fullName: userName,
    phone: '',
    address: '',
    city: 'Hồ Chí Minh',
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [notes, setNotes] = useState('')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    await onSubmit({ shippingInfo, paymentMethod, notes })
  }

  if (!isOpen) return null

  return (
    <div className="checkout-modal-overlay" onClick={onClose}>
      <div className="checkout-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            <span>Thông Tin Giao Hàng</span>
          </h2>
          <button onClick={onClose} className="btn-close-modal">
            ×
          </button>
        </div>

        {error && (
          <div className="checkout-error">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout-form">
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
              <span>{selectedTotal.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="summary-item">
              <span>Phí vận chuyển:</span>
              <span>{shippingFee.toLocaleString('vi-VN')} đ</span>
            </div>
            <div className="summary-item total">
              <span>Tổng thanh toán:</span>
              <span className="total-price">
                {(selectedTotal + shippingFee).toLocaleString('vi-VN')} đ
              </span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              onClick={onClose}
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
  )
}
