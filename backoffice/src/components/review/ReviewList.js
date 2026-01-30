import React, { useState, useEffect } from 'react'
import axios from '../../api/axiosConfig'
import ReviewCard from './ReviewCard'
import Loading from '../loading/Loading'
import { useToast } from '../common/Toast'
import './ReviewList.css'

const ReviewList = ({ productId }) => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    sortBy: 'recent',
    rating: '',
    verified: false,
  })
  const [totalPages, setTotalPages] = useState(1)
  const [totalReviews, setTotalReviews] = useState(0)
  const toast = useToast()

  useEffect(() => {
    fetchReviews()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, filters])

  const fetchReviews = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.append('page', filters.page)
      params.append('limit', filters.limit)
      params.append('sortBy', filters.sortBy)
      if (filters.rating) params.append('rating', filters.rating)
      if (filters.verified) params.append('verified', 'true')

      const response = await axios.get(`/reviews/product/${productId}?${params.toString()}`)
      setReviews(response.data.reviews)
      setTotalPages(response.data.totalPages)
      setTotalReviews(response.data.totalReviews)
      setError(null)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews')
      console.error('Error fetching reviews:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateReview = async (reviewId, updatedData) => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`/reviews/${reviewId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Review updated successfully')
      fetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update review')
    }
  }

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      await axios.delete(`/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      toast.success('Review deleted successfully')
      fetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete review')
    }
  }

  const handleMarkHelpful = async (reviewId) => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        toast.error('Please login to mark reviews as helpful')
        return
      }

      const response = await axios.post(
        `/reviews/${reviewId}/helpful`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      toast.success(response.data.message)
      fetchReviews()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to mark review as helpful')
    }
  }

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value, page: 1 }))
  }

  const handlePageChange = (page) => {
    setFilters((prev) => ({ ...prev, page }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading && reviews.length === 0) {
    return <Loading message="Loading reviews..." />
  }

  return (
    <div className="review-list-container">
      <div className="review-list-header">
        <h2>Customer Reviews ({totalReviews})</h2>
      </div>

      {/* Filters */}
      <div className="review-filters">
        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleFilterChange('sortBy', e.target.value)}
          >
            <option value="recent">Most Recent</option>
            <option value="oldest">Oldest First</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating_high">Highest Rating</option>
            <option value="rating_low">Lowest Rating</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Filter by rating:</label>
          <select
            value={filters.rating}
            onChange={(e) => handleFilterChange('rating', e.target.value)}
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="filter-group">
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={filters.verified}
              onChange={(e) => handleFilterChange('verified', e.target.checked)}
            />
            <span>Verified Purchases Only</span>
          </label>
        </div>
      </div>

      {/* Reviews List */}
      {error && <div className="error-message">{error}</div>}

      {reviews.length === 0 ? (
        <div className="no-reviews">
          <p>No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <>
          <div className="reviews-grid">
            {reviews.map((review) => (
              <ReviewCard
                key={review._id}
                review={review}
                onUpdate={handleUpdateReview}
                onDelete={handleDeleteReview}
                onMarkHelpful={handleMarkHelpful}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(filters.page - 1)}
                disabled={filters.page === 1}
                className="page-btn"
              >
                Previous
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`page-btn ${filters.page === index + 1 ? 'active' : ''}`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(filters.page + 1)}
                disabled={filters.page === totalPages}
                className="page-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default ReviewList
