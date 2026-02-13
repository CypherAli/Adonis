'use client'

import React, { useMemo, useState } from 'react'
import Link from 'next/link'
import { motion, Variants } from 'framer-motion'
import { useCart } from '@/components/providers/CartProvider'
import { useWishlist } from '@/components/providers/WishlistProvider'
import type { Product } from '@/types/product'
import { getBrandImage, getRandomShoeImage } from '@/lib/utils/placeholder_images'

interface AnimatedProductCardProps {
  product: Product
  index: number
  onQuickView?: (product: Product) => void
  userRole?: string
}

export default function AnimatedProductCard({
  product,
  index,
  onQuickView,
  userRole,
}: AnimatedProductCardProps) {
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist, loading, loadingIds } = useWishlist()

  // Normalize product ID - MongoDB returns _id, frontend may use id
  const normalizedProductId = String(product._id || product.id)
  
  // Check if this specific product is loading
  const isProductLoading = loadingIds?.has(normalizedProductId) || false

  // Helper functions
  const getPriceRange = () => {
    // If product has direct price field
    if (product.price && typeof product.price === 'number') {
      return { min: product.price, max: product.originalPrice || product.price }
    }
    
    // If product has basePrice
    if (product.basePrice && typeof product.basePrice === 'number') {
      return { min: product.basePrice, max: product.basePrice }
    }
    
    // Get price from variants
    if (product.variants && product.variants.length > 0) {
      const prices = product.variants
        .map((v) => v.price)
        .filter((p): p is number => typeof p === 'number' && p > 0)
      
      const originalPrices = product.variants
        .map((v) => v.originalPrice || v.price)
        .filter((p): p is number => typeof p === 'number' && p > 0)
      
      if (prices.length > 0) {
        return {
          min: Math.min(...prices),
          max: originalPrices.length > 0 ? Math.max(...originalPrices) : Math.max(...prices),
        }
      }
    }
    
    return { min: 0, max: 0 }
  }

  const getTotalStock = () => {
    // If product has direct stock field
    if (product.stock !== undefined) {
      return product.stock
    }
    
    // If product has totalStock field
    if (product.totalStock !== undefined) {
      return product.totalStock
    }
    
    // Calculate from variants
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v.stock || 0), 0)
    }
    
    return 0
  }

  const priceRange = getPriceRange()
  const totalStock = getTotalStock()
  const isOnSale = priceRange.max > priceRange.min && priceRange.min > 0
  const discountPercent = isOnSale && priceRange.max > 0
    ? Math.round(((priceRange.max - priceRange.min) / priceRange.max) * 100)
    : 0
  
  // Get wishlist state directly from context (using normalizedProductId from above)
  const productInWishlist = isInWishlist(normalizedProductId)

  // Animation variants
  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: 'spring',
        stiffness: 100,
        damping: 15,
        delay: index * 0.1,
      },
    },
    hover: {
      y: -8,
      scale: 1.02,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const imageVariants: Variants = {
    hover: {
      scale: 1.1,
      rotate: 2,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 20,
      },
    },
  }

  const badgeVariants: Variants = {
    initial: { scale: 0, rotate: -180 },
    animate: {
      scale: 1,
      rotate: 0,
      transition: {
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: index * 0.1 + 0.3,
      },
    },
  }

  const buttonVariants: Variants = {
    rest: { scale: 1 },
    hover: {
      scale: 1.1,
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 10,
      },
    },
    tap: { scale: 0.95 },
  }

  const glowVariants: Variants = {
    animate: {
      boxShadow: [
        '0 0 20px rgba(99, 102, 241, 0.3)',
        '0 0 40px rgba(99, 102, 241, 0.5)',
        '0 0 20px rgba(99, 102, 241, 0.3)',
      ],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  }

  const handleAddToCart = async () => {
    try {
      // Get first available variant
      const firstVariant = product.variants?.[0]
      
      // Normalize product to ensure it has all required fields
      const normalizedProduct = {
        ...product,
        _id: product._id || product.id,
        id: product.id || product._id,
        imageUrl: product.imageUrl || product.images?.[0],
        price: firstVariant?.price || product.basePrice || product.price || 0,
        stock: firstVariant?.stock || product.stock || 0,
        selectedVariant: firstVariant,
        sku: firstVariant?.sku,
      }
      
      await addToCart(normalizedProduct, 1)
    } catch (error) {
      console.error('Failed to add to cart:', error)
    }
  }

  const handleToggleWishlist = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault()
      e.stopPropagation()
    }
    if (isProductLoading) return
    await toggleWishlist(product)
  }

  const imageSrc = product.image || (product.brand ? getBrandImage(product.brand) : getRandomShoeImage())
  // Use normalized ID consistently - already defined above

  return (
    <div
      className="animated-product-card"
    >
      {/* Glow Effect on Hover */}
      <div className="card-glow" />

      {/* Image Section */}
      <Link href={`/product/${normalizedProductId}`} className="animated-image-wrapper" prefetch={true}>
        <div>
          <img
            src={imageSrc}
            alt={product.name}
            width={400}
            height={320}
            className="animated-product-image"
            loading={index < 3 ? 'eager' : 'lazy'}
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.src = '/images/placeholder-product.svg'
            }}
          />
        </div>

        {/* Badges */}
        {isOnSale && (
          <div
            className="animated-sale-badge"
          >
            -{discountPercent}%
          </div>
        )}

        {totalStock <= 0 && (
          <div
            className="animated-sold-out-badge"
          >
            Hết hàng
          </div>
        )}

        {/* Quick View Button */}
        {onQuickView && (
          <button
            className="animated-quick-view-btn"
            onClick={(e) => {
              e.preventDefault()
              onQuickView(product)
            }}
            type="button"
          >
            ×
          </button>
        )}
      </Link>

      {/* Action Buttons */}
      <div className="animated-action-buttons">
        {/* Admin và Partner không cần wishlist */}
        {userRole !== 'admin' && userRole !== 'partner' && (
          <motion.button
            className={`animated-wishlist-btn ${productInWishlist ? 'active' : ''} ${isProductLoading ? 'loading' : ''}`}
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
              handleToggleWishlist()
            }}
            disabled={isProductLoading}
            whileTap={{ scale: 0.85 }}
            type="button"
            aria-label={productInWishlist ? 'Xóa khỏi yêu thích' : 'Thêm vào yêu thích'}
          >
            {isProductLoading ? '⏳' : productInWishlist ? '❤️' : '🤍'}
          </motion.button>
        )}
      </div>

      {/* Product Info */}
      <div className="animated-product-info">
        <div
          className="animated-product-brand"
        >
          {product.brand || 'No Brand'}
        </div>

        <Link href={`/product/${normalizedProductId}`}>
          <h3
            className="animated-product-name"
          >
            {product.name}
          </h3>
        </Link>

        <p
          className="animated-product-description"
        >
          {product.description || 'No description available'}
        </p>

        {/* Price Section */}
        <div
          className="animated-product-price"
        >
          {isOnSale && priceRange.max > 0 && (
            <span className="animated-original-price">
              {priceRange.max.toLocaleString('vi-VN')} VND
            </span>
          )}
          <span className={`animated-current-price ${isOnSale ? 'sale-price' : ''}`}>
            {(priceRange.min || 0).toLocaleString('vi-VN')} VND
          </span>
        </div>

        {/* Footer */}
        <div className="animated-product-footer">
          <span
            className="animated-stock-status"
            style={{
              color: totalStock > 0 ? '#10b981' : '#e74c3c',
            }}
          >
            {totalStock > 0 ? `Còn ${totalStock} sản phẩm` : 'Hết hàng'}
          </span>

          {/* Admin và Partner không cần add to cart */}
          {userRole !== 'admin' &&
            userRole !== 'partner' &&
            (totalStock > 0 ? (
              <button
                className="animated-add-btn"
                onClick={handleAddToCart}
                type="button"
              >
                Thêm
              </button>
            ) : (
              <button className="animated-notify-btn" disabled type="button">
                Thông báo
              </button>
            ))}
        </div>
      </div>
    </div>
  )
}
