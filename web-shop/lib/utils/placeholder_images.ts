/**
 * PLACEHOLDER_IMAGES - Fallback images for products
 * Extracted from React SPA web-shop/src/utils/placeholder.js
 */

// Real shoe images URLs from unsplash and official brands
export const PLACEHOLDER_IMAGES = {
  // Default product images - using Unsplash for stability
  product: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  productSmall: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
  productLarge: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80',
  thumbnail: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&q=80',
  cart: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80',
  avatar: '/images/placeholder-product.svg',

  // Brand-specific fallback images - all from stable Unsplash
  nike: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  adidas: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
  converse: 'https://images.unsplash.com/photo-1514989771522-458c9b6c035a?w=800&q=80',
  vans: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
  puma: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800&q=80',
  newbalance: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800&q=80',

  // Generic fallback images (7 variations) - all from Unsplash for stability
  shoe_generic_1: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80',
  shoe_generic_2: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
  shoe_generic_3: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=800&q=80',
  shoe_generic_4: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
  shoe_generic_5: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800&q=80',
  shoe_generic_6: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&q=80',
  shoe_generic_7: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
} as const

/**
 * Get a random shoe image from generic fallbacks
 */
export const getRandomShoeImage = (): string => {
  const genericImages = [
    PLACEHOLDER_IMAGES.shoe_generic_1,
    PLACEHOLDER_IMAGES.shoe_generic_2,
    PLACEHOLDER_IMAGES.shoe_generic_3,
    PLACEHOLDER_IMAGES.shoe_generic_4,
    PLACEHOLDER_IMAGES.shoe_generic_5,
    PLACEHOLDER_IMAGES.shoe_generic_6,
    PLACEHOLDER_IMAGES.shoe_generic_7,
  ]

  return genericImages[Math.floor(Math.random() * genericImages.length)]!
}

/**
 * Get brand-specific placeholder image
 * @param brand - Brand name (Nike, Adidas, etc.)
 * @returns Brand-specific placeholder or random generic
 */
export const getBrandImage = (brand: string): string => {
  const brandLower = brand.toLowerCase().trim()

  // Map brand names to placeholder keys
  const brandMap: Record<string, keyof typeof PLACEHOLDER_IMAGES> = {
    'nike': 'nike',
    'adidas': 'adidas',
    'converse': 'converse',
    'vans': 'vans',
    'puma': 'puma',
    'new balance': 'newbalance',
    'newbalance': 'newbalance',
  }

  const key = brandMap[brandLower]
  if (key && key in PLACEHOLDER_IMAGES) {
    return PLACEHOLDER_IMAGES[key]
  }

  // Fallback to random generic
  return getRandomShoeImage()
}

/**
 * Get placeholder by size
 * @param size - 'small' | 'medium' | 'large' | 'thumbnail' | 'cart'
 */
export const getPlaceholderBySize = (size: string): string => {
  const sizeMap: Record<string, keyof typeof PLACEHOLDER_IMAGES> = {
    small: 'productSmall',
    medium: 'product',
    large: 'productLarge',
    thumbnail: 'thumbnail',
    cart: 'cart',
  }

  const key = sizeMap[size]
  return key && key in PLACEHOLDER_IMAGES ? PLACEHOLDER_IMAGES[key] : PLACEHOLDER_IMAGES.product
}
