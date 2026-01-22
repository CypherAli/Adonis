import React, { useState, useContext } from 'react'
import axios from '../../api/axiosConfig'
import RatingStars from '../rating/RatingStars'
import AuthContext from '../../context/AuthContext'
import { useToast } from '../common/Toast'
import { FiX, FiPlus, FiMinus } from 'react-icons/fi'
import './ReviewForm.css'

const ReviewForm = ({ productId, productName, onSuccess, onCancel }) => {
  const { user } = useContext(AuthContext)
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    rating: 5,
    title: '',
    comment: '',
    pros: [''],
    cons: [''],
  })

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      toast.error('Please login to write a review')
      return
    }

    if (formData.rating < 1 || formData.rating > 5) {
      toast.error('Please select a rating')
      return
    }

    if (!formData.title.trim()) {
      toast.error('Please enter a review title')
      return
    }

    if (!formData.comment.trim()) {
      toast.error('Please enter a review comment')
      return
    }

    try {
      setLoading(true)
      const token = localStorage.getItem('token')

      // Filter out empty pros and cons
      const pros = formData.pros.filter((p) => p.trim() !== '')
      const cons = formData.cons.filter((c) => c.trim() !== '')

      const reviewData = {
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        pros: pros.length > 0 ? pros : undefined,
        cons: cons.length > 0 ? cons : undefined,
      }

      await axios.post(`/reviews/product/${productId}`, reviewData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      toast.success('Review submitted successfully!')

      // Reset form
      setFormData({
        rating: 5,
        title: '',
        comment: '',
        pros: [''],
        cons: [''],
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit review')
      console.error('Error submitting review:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = (rating) => {
    setFormData({ ...formData, rating })
  }

  const handleAddPro = () => {
    setFormData({ ...formData, pros: [...formData.pros, ''] })
  }

  const handleRemovePro = (index) => {
    const newPros = formData.pros.filter((_, i) => i !== index)
    setFormData({ ...formData, pros: newPros.length > 0 ? newPros : [''] })
  }

  const handleProChange = (index, value) => {
    const newPros = [...formData.pros]
    newPros[index] = value
    setFormData({ ...formData, pros: newPros })
  }

  const handleAddCon = () => {
    setFormData({ ...formData, cons: [...formData.cons, ''] })
  }

  const handleRemoveCon = (index) => {
    const newCons = formData.cons.filter((_, i) => i !== index)
    setFormData({ ...formData, cons: newCons.length > 0 ? newCons : [''] })
  }

  const handleConChange = (index, value) => {
    const newCons = [...formData.cons]
    newCons[index] = value
    setFormData({ ...formData, cons: newCons })
  }

  if (!user) {
    return (
      <div className="review-form-login">
        <p>Please login to write a review</p>
        <button onClick={() => (window.location.href = '/login')}>Login</button>
      </div>
    )
  }

  return (
    <div className="review-form-container">
      <div className="review-form-header">
        <h2>Write a Review</h2>
        {onCancel && (
          <button className="close-btn" onClick={onCancel}>
            <FiX />
          </button>
        )}
      </div>

      <div className="product-info">
        <p>
          Reviewing: <strong>{productName}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="review-form">
        <div className="form-group">
          <label>Your Rating *</label>
          <RatingStars
            rating={formData.rating}
            interactive={true}
            showNumber={true}
            size="large"
            onRatingChange={handleRatingChange}
          />
          <p className="helper-text">Click on stars to rate</p>
        </div>

        <div className="form-group">
          <label>Review Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="Sum up your experience in one line"
            maxLength={200}
            required
          />
          <span className="char-count">{formData.title.length}/200</span>
        </div>

        <div className="form-group">
          <label>Your Review *</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            placeholder="Share your experience with this product..."
            rows={6}
            maxLength={2000}
            required
          />
          <span className="char-count">{formData.comment.length}/2000</span>
        </div>

        <div className="form-group">
          <label>Pros (Optional)</label>
          <p className="helper-text">What did you like about this product?</p>
          {formData.pros.map((pro, index) => (
            <div key={index} className="list-input">
              <input
                type="text"
                value={pro}
                onChange={(e) => handleProChange(index, e.target.value)}
                placeholder={`Pro #${index + 1}`}
                maxLength={100}
              />
              {formData.pros.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => handleRemovePro(index)}>
                  <FiMinus />
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={handleAddPro}>
            <FiPlus /> Add Pro
          </button>
        </div>

        <div className="form-group">
          <label>Cons (Optional)</label>
          <p className="helper-text">What could be improved?</p>
          {formData.cons.map((con, index) => (
            <div key={index} className="list-input">
              <input
                type="text"
                value={con}
                onChange={(e) => handleConChange(index, e.target.value)}
                placeholder={`Con #${index + 1}`}
                maxLength={100}
              />
              {formData.cons.length > 1 && (
                <button type="button" className="remove-btn" onClick={() => handleRemoveCon(index)}>
                  <FiMinus />
                </button>
              )}
            </div>
          ))}
          <button type="button" className="add-btn" onClick={handleAddCon}>
            <FiPlus /> Add Con
          </button>
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </button>
          {onCancel && (
            <button type="button" className="cancel-btn" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default ReviewForm
