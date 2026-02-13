"use client"

import React from 'react'
import './RatingStars.css'

interface RatingStarsProps {
  rating?: number
  totalStars?: number
  size?: 'small' | 'medium' | 'large'
  showNumber?: boolean
  reviewCount?: number
  interactive?: boolean
  onRatingChange?: ((value: number) => void) | null
}

const RatingStars = ({
  rating = 0,
  totalStars = 5,
  size = 'medium',
  showNumber = true,
  reviewCount = 0,
  interactive = false,
  onRatingChange = null,
}: RatingStarsProps) => {
  const [hoverRating, setHoverRating] = React.useState(0)

  const handleClick = (value: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(value)
    }
  }

  const handleMouseEnter = (value: number) => {
    if (interactive) {
      setHoverRating(value)
    }
  }

  const handleMouseLeave = () => {
    if (interactive) {
      setHoverRating(0)
    }
  }

  const displayRating = hoverRating || rating

  const renderStars = () => {
    const stars = []
    for (let i = 1; i <= totalStars; i++) {
      const filled = displayRating >= i
      const halfFilled = displayRating >= i - 0.5 && displayRating < i

      stars.push(
        <span
          key={i}
          className={`star ${interactive ? 'interactive' : ''}`}
          onClick={() => handleClick(i)}
          onMouseEnter={() => handleMouseEnter(i)}
          onMouseLeave={handleMouseLeave}
        >
          {filled ? (
            <span className="star-icon filled">★</span>
          ) : halfFilled ? (
            <span className="star-icon half-filled">☆</span>
          ) : (
            <span className="star-icon empty">☆</span>
          )}
        </span>
      )
    }
    return stars
  }

  return (
    <div className={`rating-stars size-${size}`}>
      <div className="stars-container">{renderStars()}</div>
      {showNumber && (
        <span className="rating-text">
          <strong>{rating.toFixed(1)}</strong>
          {reviewCount > 0 && <span className="review-count"> ({reviewCount} reviews)</span>}
        </span>
      )}
    </div>
  )
}

export default RatingStars
