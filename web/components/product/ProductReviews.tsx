'use client'

import { useState } from 'react'
import { FaStar, FaUser } from 'react-icons/fa'
import { motion } from 'framer-motion'

interface Review {
  id: string
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export default function ProductReviews({ productId }: { productId: string }) {
  const [reviews] = useState<Review[]>([
    {
      id: '1',
      userName: 'Nguyễn Văn A',
      rating: 5,
      comment: 'Sản phẩm rất tốt, đúng như mô tả!',
      createdAt: '2026-01-15',
    },
    {
      id: '2',
      userName: 'Trần Thị B',
      rating: 4,
      comment: 'Chất lượng ổn, giao hàng nhanh',
      createdAt: '2026-01-10',
    },
  ])

  return (
    <div className="mt-12">
      <h3 className="text-2xl font-bold mb-6">Đánh Giá Sản Phẩm</h3>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-xl shadow-md"
          >
            <div className="flex items-center gap-4 mb-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                <FaUser className="text-gray-500" />
              </div>
              <div>
                <p className="font-semibold">{review.userName}</p>
                <div className="flex items-center gap-2">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        className={i < review.rating ? 'text-yellow-400' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-gray-700">{review.comment}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
