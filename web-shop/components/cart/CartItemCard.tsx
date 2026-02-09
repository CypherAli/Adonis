"use client"

import { memo } from 'react'

interface CartItemCardProps {
  item: {
    _id: string
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
  isSelected: boolean
  onToggleSelect: (itemId: string) => void
  onUpdateQuantity: (itemId: string, quantity: number) => void
  onRemove: (itemId: string) => void
}

const CartItemCard = memo(function CartItemCard({
  item,
  isSelected,
  onToggleSelect,
  onUpdateQuantity,
  onRemove,
}: CartItemCardProps) {
  return (
    <div className={`cart-item-card ${isSelected ? 'selected' : ''}`}>
      <label className="checkbox-container">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={() => onToggleSelect(item._id)}
        />
        <span className="checkmark"></span>
      </label>

      <div className="item-image">
        <img
          src={item.imageUrl || '/images/placeholder-product.svg'}
          alt={item.name}
          loading="lazy"
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
            onClick={() => onUpdateQuantity(item._id, item.quantity - 1)}
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
                onUpdateQuantity(item._id, val)
              }
            }}
            min="1"
            max={item.stock}
            className="qty-input"
          />
          <button
            onClick={() => onUpdateQuantity(item._id, item.quantity + 1)}
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
              onRemove(item._id)
            }
          }}
          className="btn-remove-item"
          title="Xóa sản phẩm"
        >
          ×
        </button>
      </div>
    </div>
  )
})

export default CartItemCard
