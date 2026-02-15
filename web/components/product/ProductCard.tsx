'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { FaHeart, FaRegHeart, FaShoppingCart, FaStar } from 'react-icons/fa'
import { useCart } from '@/components/providers/CartProvider'
import { useWishlist } from '@/components/providers/WishlistProvider'
import { getBrandImage, getRandomShoeImage } from '@/lib/utils/placeholder_images'

interface Product {
  id?: string
  _id?: string
  name: string
  price: number
  originalPrice?: number
  image: string
  brand: string
  rating: number
  reviewCount: number
}

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist, loading, loadingIds } = useWishlist()
  const [imageError, setImageError] = useState(false)
  const [imageSrc, setImageSrc] = useState(product.image)

  // Normalize product ID - MongoDB returns _id, frontend may use id
  const productId = String(product._id || product.id)

  // Get wishlist state directly from context
  const inWishlist = isInWishlist(productId)
  
  // Check if this specific product is loading
  const isProductLoading = loadingIds?.has(productId) || false

  const handleImageError = () => {
    if (!imageError) {
      const fallbackImage = product.brand ? getBrandImage(product.brand) : getRandomShoeImage()
      setImageSrc(fallbackImage)
      setImageError(true)
    }
  }

  const handleAddToCart = async () => {
    try {
      await addToCart({
        _id: productId,
        id: productId,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        brand: product.brand,
      }, 1)
      alert('Đã thêm vào giỏ hàng!')
    } catch (error) {
      // Silently handle expected errors (guest cart always works)
      if (process.env.NODE_ENV === 'development') {
        console.error('Error adding to cart:', error)
      }
    }
  }

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    // Prevent action if already loading this product
    if (isProductLoading) return
    
    try {
      await toggleWishlist({
        _id: productId,
        id: productId,
        name: product.name,
        price: product.price,
        imageUrl: product.image,
        brand: product.brand,
      })
    } catch (error) {
      // Errors are handled in provider
      if (process.env.NODE_ENV === 'development') {
        console.error('Toggle wishlist error:', error)
      }
    }
  }

  return (
    <motion.div
      whileHover={{ y: -8 }}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300"
    >
      <Link href={`/product/${productId}`} className="block relative">
        <div className="relative h-64 overflow-hidden bg-gray-100">
          <Image
            src={imageSrc}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={handleImageError}
            unoptimized={imageError}
          />
          
          {product.originalPrice && (
            <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
              -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
            </div>
          )}
          
          {/* Wishlist Button */}
          <motion.button
            onClick={handleToggleWishlist}
            disabled={isProductLoading}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-4 right-4 p-2.5 rounded-full shadow-lg transition-all duration-200 ${
              inWishlist 
                ? 'bg-red-500 text-white' 
                : 'bg-white/90 text-gray-500 hover:text-red-500'
            } ${isProductLoading ? 'opacity-50' : ''}`}
          >
            {isProductLoading ? '⏳' : inWishlist ? <FaHeart className="w-5 h-5" /> : <FaRegHeart className="w-5 h-5" />}
          </motion.button>
        </div>
      </Link>

      <div className="p-4">
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-gray-900 mb-2 hover:text-blue-600 line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={`star-${product.id}-${i}`}
                className={i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">({product.reviewCount})</span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">
              {product.price.toLocaleString('vi-VN')}₫
            </p>
            {product.originalPrice && (
              <p className="text-sm text-gray-400 line-through">
                {product.originalPrice.toLocaleString('vi-VN')}₫
              </p>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </motion.div>
  )
}
