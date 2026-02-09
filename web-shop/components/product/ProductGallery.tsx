'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductGalleryProps {
  images: string[]
  productName: string
}

export default function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [imageErrors, setImageErrors] = useState<Record<number, boolean>>({})

  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }))
  }

  const validImages = images.filter((_, index) => !imageErrors[index])
  const currentImage = validImages[Math.min(selectedImage, validImages.length - 1)]

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative h-96 md:h-[500px] bg-gray-100 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative w-full h-full"
          >
            {currentImage ? (
              <img
                src={currentImage}
                alt={`${productName} - Image ${selectedImage + 1}`}
                className="absolute inset-0 w-full h-full object-cover"
                loading={selectedImage === 0 ? 'eager' : 'lazy'}
                onError={() => handleImageError(selectedImage)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnail Grid */}
      {validImages.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => (
            !imageErrors[index] && (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`relative h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === index
                    ? 'border-blue-600 scale-105'
                    : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} thumbnail ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  loading="lazy"
                  onError={() => handleImageError(index)}
                />
              </button>
            )
          ))}
        </div>
      )}
    </div>
  )
}
