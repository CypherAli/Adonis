"use client"

import { memo } from 'react'

interface WishlistCardProps {
  product: {
    _id: string
    name: string
    brand: string
    imageUrl?: string
  }
  price: number
  stock: number
  onMoveToCart: (product: any) => void
  onRemove: (productId: string) => void
}

const WishlistCard = memo(function WishlistCard({
  product,
  price,
  stock,
  onMoveToCart,
  onRemove,
}: WishlistCardProps) {
  return (
    <div className="wishlist-card">
      <button
        className="btn-remove-item"
        onClick={() => onRemove(product._id)}
        title="Xóa khỏi danh sách yêu thích"
      >
        ×
      </button>

      <div className="wishlist-image-wrapper">
        <img
          src={product.imageUrl || '/images/placeholder-product.svg'}
          alt={product.name}
          className="wishlist-image"
          loading="lazy"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = '/images/placeholder-product.svg'
          }}
        />
        {stock <= 0 && (
          <div className="out-of-stock-overlay">
            <span>Hết hàng</span>
          </div>
        )}
      </div>

      <div className="wishlist-info">
        <h3 className="wishlist-product-name">{product.name}</h3>
        <p className="wishlist-brand">{product.brand}</p>

        <div className="wishlist-price">
          <span className="price-value">{price.toLocaleString()} VNĐ</span>
        </div>

        <div className="wishlist-stock">
          {stock > 0 ? (
            <span className="in-stock">Còn {stock} sản phẩm</span>
          ) : (
            <span className="out-of-stock">Hết hàng</span>
          )}
        </div>

        <div className="wishlist-actions">
          <button
            className="btn-move-to-cart"
            onClick={() => onMoveToCart(product)}
            disabled={stock <= 0}
          >
            Thêm vào giỏ
          </button>
          <button className="btn-remove" onClick={() => onRemove(product._id)}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  )
})

export default WishlistCard
