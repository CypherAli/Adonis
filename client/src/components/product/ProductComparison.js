import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from '../../api/axiosConfig'
import RatingStars from '../rating/RatingStars'
import Loading from '../loading/Loading'
import { useToast } from '../common/Toast'
import { FiX, FiShare2, FiShoppingCart } from 'react-icons/fi'
import './ProductComparison.css'

const ProductComparison = ({ productIds, onClose }) => {
  const [products, setProducts] = useState([])
  const [comparisonData, setComparisonData] = useState(null)
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchComparison = React.useCallback(async () => {
    try {
      setLoading(true)
      // Fix: Remove duplicate /api since axiosConfig already has /api in baseURL
      const response = await axios.post('/comparisons/compare', {
        productIds,
      })
      setProducts(response.data.products)
      setComparisonData(response.data)
    } catch (err) {
      toast.error('Failed to load comparison data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [productIds, toast])

  useEffect(() => {
    if (productIds && productIds.length >= 2) {
      fetchComparison()
    }
  }, [productIds, fetchComparison])

  const handleShare = async () => {
    try {
      const token = localStorage.getItem('token')
      // Fix: Remove duplicate /api
      const response = await axios.post(
        '/comparisons/save',
        {
          productIds,
          isPublic: true,
        },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      )

      const shareUrl = `${window.location.origin}/compare/${response.data.comparison.slug}`

      if (navigator.clipboard) {
        await navigator.clipboard.writeText(shareUrl)
        toast.success('Comparison link copied to clipboard!')
      } else {
        toast.info(`Share this link: ${shareUrl}`)
      }
    } catch (err) {
      toast.error('Failed to create shareable link')
    }
  }

  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN') + ' VND'
  }

  if (loading) {
    return <Loading message="Loading comparison..." />
  }

  if (!products || products.length < 2) {
    return (
      <div className="comparison-error">
        <p>Please select at least 2 products to compare</p>
        <button onClick={onClose}>Close</button>
      </div>
    )
  }

  const specFields = [
    { key: 'processor', label: 'Processor' },
    { key: 'ram', label: 'RAM' },
    { key: 'storage', label: 'Storage' },
    { key: 'graphics', label: 'Graphics' },
    { key: 'display', label: 'Display' },
    { key: 'displaySize', label: 'Display Size' },
    { key: 'displayResolution', label: 'Resolution' },
    { key: 'weight', label: 'Weight' },
    { key: 'battery', label: 'Battery' },
    { key: 'operatingSystem', label: 'OS' },
  ]

  return (
    <div className="comparison-modal-overlay" onClick={onClose}>
      <div className="comparison-modal" onClick={(e) => e.stopPropagation()}>
        <div className="comparison-header">
          <h2>Product Comparison</h2>
          <div className="header-actions">
            <button className="share-btn" onClick={handleShare}>
              <FiShare2 /> Share
            </button>
            <button className="close-btn" onClick={onClose}>
              <FiX />
            </button>
          </div>
        </div>

        <div className="comparison-content">
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="label-column">Specifications</th>
                  {products.map((product) => (
                    <th key={product._id} className="product-column">
                      <div className="product-header">
                        <Link to={`/product/${product._id}`}>
                          <img src={product.imageUrl} alt={product.name} className="product-img" />
                        </Link>
                        <h3>{product.name}</h3>
                        <p className="brand">{product.brand}</p>
                        <RatingStars
                          rating={product.rating?.average || 0}
                          reviewCount={product.rating?.count || 0}
                          size="small"
                        />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Price Row */}
                <tr className="highlight-row">
                  <td className="label-cell">Price</td>
                  {products.map((product) => (
                    <td key={product._id} className="value-cell">
                      <div className="price-info">
                        <span className="current-price">{formatPrice(product.price)}</span>
                        {product.originalPrice && product.originalPrice > product.price && (
                          <>
                            <span className="original-price">
                              {formatPrice(product.originalPrice)}
                            </span>
                            <span className="discount-badge">
                              -
                              {Math.round(
                                ((product.originalPrice - product.price) / product.originalPrice) *
                                  100
                              )}
                              %
                            </span>
                          </>
                        )}
                      </div>
                    </td>
                  ))}
                </tr>

                {/* Stock Status */}
                <tr>
                  <td className="label-cell">Availability</td>
                  {products.map((product) => (
                    <td key={product._id} className="value-cell">
                      <span
                        className={`stock-badge ${product.stock > 0 ? 'in-stock' : 'out-of-stock'}`}
                      >
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Specifications */}
                {specFields.map(({ key, label }) => (
                  <tr key={key}>
                    <td className="label-cell">{label}</td>
                    {products.map((product) => (
                      <td key={product._id} className="value-cell">
                        {product.specifications?.[key] || 'N/A'}
                      </td>
                    ))}
                  </tr>
                ))}

                {/* Warranty */}
                <tr>
                  <td className="label-cell">Warranty</td>
                  {products.map((product) => (
                    <td key={product._id} className="value-cell">
                      {product.warranty?.duration || 'N/A'}
                    </td>
                  ))}
                </tr>

                {/* Action Row */}
                <tr className="action-row">
                  <td className="label-cell"></td>
                  {products.map((product) => (
                    <td key={product._id} className="value-cell">
                      <Link to={`/product/${product._id}`} className="view-details-btn">
                        <FiShoppingCart /> View Details
                      </Link>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Price Analysis */}
          {comparisonData && comparisonData.pricing && (
            <div className="price-analysis">
              <h3>Price Analysis</h3>
              <div className="price-stats">
                <div className="stat">
                  <span className="label">Lowest Price:</span>
                  <span className="value">{formatPrice(comparisonData.pricing.lowestPrice)}</span>
                </div>
                <div className="stat">
                  <span className="label">Highest Price:</span>
                  <span className="value">{formatPrice(comparisonData.pricing.highestPrice)}</span>
                </div>
                <div className="stat">
                  <span className="label">Price Difference:</span>
                  <span className="value">
                    {formatPrice(
                      comparisonData.pricing.highestPrice - comparisonData.pricing.lowestPrice
                    )}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductComparison
