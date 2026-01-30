import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../api/axiosConfig'
import { useToast } from '../common/Toast'
import { PLACEHOLDER_IMAGES } from '../../utils/placeholder'
import './ProfileTabs.css'

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const toast = useToast()

  useEffect(() => {
    fetchWishlist()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchWishlist = async () => {
    try {
      const response = await axios.get('/user/wishlist')
      setWishlist(response.data)
    } catch (error) {
      console.error('Fetch wishlist error:', error)
      toast.error('Cannot load wishlist')
    } finally {
      setLoading(false)
    }
  }

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`/user/wishlist/${productId}`)
      setWishlist(wishlist.filter((item) => item.product._id !== productId))
      toast.success('Removed from wishlist')
    } catch (error) {
      console.error('Remove wishlist error:', error)
      toast.error('Failed to remove product')
    }
  }

  const handleAddToCart = async (product) => {
    try {
      await axios.post('/cart', {
        productId: product._id,
        quantity: 1,
      })
      toast.success('Added to cart')
    } catch (error) {
      console.error('Add to cart error:', error)
      toast.error(error.response?.data?.message || 'Cannot add to cart')
    }
  }

  const handleViewProduct = (productId) => {
    navigate(`/product/${productId}`)
  }

  if (loading) {
    return (
      <div className="profile-tab-loading">
        <div className="spinner"></div>
        <p>Đang tải...</p>
      </div>
    )
  }

  if (wishlist.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">❤️</div>
        <h3>Wishlist is empty</h3>
        <p>You haven't added any products to your wishlist</p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Explore Products
        </button>
      </div>
    )
  }

  return (
    <div className="wishlist-tab">
      <div className="tab-header">
        <h2>
          <span className="icon">❤️</span>
          Wishlist
        </h2>
        <p className="subtitle">
          {wishlist.length} {wishlist.length === 1 ? 'product' : 'products'}
        </p>
      </div>

      <div className="wishlist-grid">
        {wishlist.map((item) => (
          <div key={item._id} className="wishlist-card">
            <div className="wishlist-image">
              <img
                src={item.product?.imageUrl || PLACEHOLDER_IMAGES.product}
                alt={item.product?.name}
                onClick={() => handleViewProduct(item.product._id)}
                style={{ cursor: 'pointer' }}
              />
              <button
                className="btn-remove"
                onClick={() => handleRemove(item.product._id)}
                title="Remove from wishlist"
              >
                ×
              </button>
              {(!item.product?.stock || item.product?.stock <= 0) && (
                <div className="out-of-stock-badge">Out of Stock</div>
              )}
            </div>

            <div className="wishlist-info">
              <h3 onClick={() => handleViewProduct(item.product._id)} style={{ cursor: 'pointer' }}>
                {item.product?.name}
              </h3>

              <div className="product-specs">
                {item.product?.brand && <span className="spec-badge">{item.product.brand}</span>}
                {item.product?.model && <span className="spec-badge">{item.product.model}</span>}
              </div>

              <div className="wishlist-price">
                <span className="price">{item.product?.price?.toLocaleString()} ₫</span>
              </div>

              <div className="wishlist-actions">
                <button
                  className="btn-add-cart"
                  onClick={() => handleAddToCart(item.product)}
                  disabled={!item.product?.stock || item.product?.stock <= 0}
                >
                  <span>🛒</span>
                  Add to Cart
                </button>
                <button className="btn-view" onClick={() => handleViewProduct(item.product._id)}>
                  View Details
                </button>
              </div>

              <div className="added-date">
                Đã thêm: {new Date(item.addedAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Wishlist
