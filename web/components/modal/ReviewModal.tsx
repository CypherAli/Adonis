'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiStar, FiX } from 'react-icons/fi'
import { AiFillStar } from 'react-icons/ai'
import api from '@/lib/api'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productId: string
  productName: string
  productImage: string
  orderId: string
  onSubmitSuccess: () => void
}

const ReviewModal: React.FC<ReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  orderId,
  onSubmitSuccess,
}) => {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [title, setTitle] = useState('')
  const [comment, setComment] = useState('')
  const [pros, setPros] = useState('')
  const [cons, setCons] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (rating === 0) {
      setError('Vui lòng chọn số sao đánh giá')
      return
    }

    if (!title.trim()) {
      setError('Vui lòng nhập tiêu đề đánh giá')
      return
    }

    if (!comment.trim()) {
      setError('Vui lòng nhập nội dung đánh giá')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await api.post('/api/reviews', {
        productId,
        orderId,
        rating,
        title: title.trim(),
        comment: comment.trim(),
        pros: pros.trim() ? pros.split(',').map((p) => p.trim()) : [],
        cons: cons.trim() ? cons.split(',').map((c) => c.trim()) : [],
      })

      if (response.status >= 400) {
        throw new Error(response.data.message || 'Không thể gửi đánh giá')
      }

      // Success!
      onSubmitSuccess()
      handleClose()
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setRating(0)
    setHoverRating(0)
    setTitle('')
    setComment('')
    setPros('')
    setCons('')
    setError(null)
    onClose()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-xl"
          >
            {/* Header */}
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-bold">Đánh giá sản phẩm</h2>
              <button
                onClick={handleClose}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            {/* Product Info */}
            <div className="px-6 py-4 border-b flex items-center gap-4">
              {productImage ? (
                <img
                  src={productImage}
                  alt={productName}
                  className="w-16 h-16 object-cover rounded"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                  <FiStar className="w-6 h-6 text-gray-400" />
                </div>
              )}
              <div>
                <h3 className="font-semibold">{productName}</h3>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Đánh giá của bạn <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      {star <= (hoverRating || rating) ? (
                        <AiFillStar className="w-8 h-8 text-yellow-400" />
                      ) : (
                        <FiStar className="w-8 h-8 text-gray-300" />
                      )}
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm text-gray-600">
                      {rating === 5 && 'Tuyệt vời'}
                      {rating === 4 && 'Tốt'}
                      {rating === 3 && 'Bình thường'}
                      {rating === 2 && 'Tệ'}
                      {rating === 1 && 'Rất tệ'}
                    </span>
                  )}
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tiêu đề <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Tóm tắt đánh giá của bạn"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  maxLength={100}
                />
              </div>

              {/* Comment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nội dung đánh giá <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm..."
                  rows={5}
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              {/* Pros */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Ưu điểm (tách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={pros}
                  onChange={(e) => setPros(e.target.value)}
                  placeholder="Chất lượng tốt, Giá hợp lý, Đẹp"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Cons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nhược điểm (tách bằng dấu phẩy)
                </label>
                <input
                  type="text"
                  value={cons}
                  onChange={(e) => setCons(e.target.value)}
                  placeholder="Giao hàng chậm, Kích thước nhỏ hơn mô tả"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Error */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={isSubmitting}
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ReviewModal
