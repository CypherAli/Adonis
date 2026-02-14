"use client"

import { useContext, useEffect, useMemo, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { useWishlist } from '@/components/providers/WishlistProvider'
import { useCart } from '@/components/providers/CartProvider'
import './wishlist.css'

export default function WishlistPage() {
  const { data: session } = useSession()
  const { wishlist, removeFromWishlist, clearWishlist, loading } = useWishlist()
  const { addToCart } = useCart()
  const router = useRouter()

  // Redirect admin to home - Admin không cần wishlist
  useEffect(() => {
    if (session?.user?.role === 'admin') {
      router.push('/')
    }
  }, [session, router])

  // Helper to get product price - Memoized
  const getProductPrice = useCallback((product: any) => {
    if (product.finalPrice) return product.finalPrice
    if (product.displayPrice) return product.displayPrice
    if (product.price) return product.price
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].price || 0
    }
    if (product.basePrice) return product.basePrice
    return 0
  }, [])

  // Helper to get product stock - Memoized
  const getProductStock = useCallback((product: any) => {
    if (product.stock !== undefined) return product.stock
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((total: number, v: any) => total + (v.stock || 0), 0)
    }
    return 0
  }, [])

  const handleAddToCart = useCallback((product: any) => {
    addToCart(product)
    alert(`${product.name} đã được thêm vào giỏ hàng!`)
  }, [addToCart])

  const handleMoveToCart = useCallback((product: any) => {
    const productId = String(product._id || product.id)
    addToCart(product)
    removeFromWishlist(productId)
    alert(`${product.name} đã được chuyển vào giỏ hàng!`)
  }, [addToCart, removeFromWishlist])

  if (loading) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <div className="spinner">🔄</div>
          <h2>Đang tải...</h2>
        </div>
      </div>
    )
  }

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="wishlist-page">
        <div className="wishlist-empty">
          <div className="empty-icon">❤️</div>
          <h2>Danh sách yêu thích trống</h2>
          <p>Thêm sản phẩm bạn yêu thích để xem sau!</p>
          <button className="btn-shop" onClick={() => router.push('/')}>
            Khám Phá Sản Phẩm
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <div className="header-left">
          <h1>
            <span className="heart-icon">❤️</span>
            Danh Sách Yêu Thích
          </h1>
          <span className="wishlist-count">{wishlist.length} sản phẩm</span>
        </div>
        <button className="btn-clear-all" onClick={clearWishlist}>
          Xóa tất cả
        </button>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((product: any) => {
          const productId = String(product._id || product.id)
          return (
          <div key={productId} className="wishlist-card">
            <button
              className="btn-remove-item"
              onClick={() => removeFromWishlist(productId)}
              title="Xóa khỏi danh sách yêu thích"
            >
              ×
            </button>

            <div className="wishlist-image-wrapper">
              <img
                src={product.imageUrl || '/images/placeholder-product.svg'}
                alt={product.name}
                className="wishlist-image"
              />
              {getProductStock(product) <= 0 && (
                <div className="out-of-stock-overlay">
                  <span>Hết hàng</span>
                </div>
              )}
            </div>

            <div className="wishlist-info">
              <h3 className="wishlist-product-name">{product.name}</h3>
              <p className="wishlist-brand">{product.brand}</p>

              <div className="wishlist-price">
                <span className="price-value">{getProductPrice(product).toLocaleString()} VNĐ</span>
              </div>

              <div className="wishlist-stock">
                {getProductStock(product) > 0 ? (
                  <span className="in-stock">Còn {getProductStock(product)} sản phẩm</span>
                ) : (
                  <span className="out-of-stock">Hết hàng</span>
                )}
              </div>

              <div className="wishlist-actions">
                <button
                  className="btn-move-to-cart"
                  onClick={() => handleMoveToCart(product)}
                  disabled={getProductStock(product) <= 0}
                >
                  Thêm vào giỏ
                </button>
                <button className="btn-remove" onClick={() => removeFromWishlist(productId)}>
                  Xóa
                </button>
              </div>
            </div>

            {product.addedAt && (
              <div className="added-date">
                Đã thêm: {new Date(product.addedAt).toLocaleDateString('vi-VN')}
              </div>
            )}
          </div>
          )
        })}
      </div>
    </div>
  )
}
