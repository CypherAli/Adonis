/**
 * PLACEHOLDER_IMAGES - Fallback images for products
 * Extracted from React SPA web-shop/src/utils/placeholder.js
 */

// Real shoe images URLs from unsplash and official brands
export const PLACEHOLDER_IMAGES = {
  // Default product images
  product:
    'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-air-max-90-by-you-shoes.png',
  productSmall:
    'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_Light_Shoes_Black_GY9350_01_standard.jpg',
  productLarge:
    'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/af53d53d-561f-450a-a483-70a7ceee380f/dunk-low-retro-shoes-66RGq8.png',
  thumbnail:
    'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/374915/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Sneakers',
  cart: 'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw6f1c0e4d/images/a_107/M9160_A_107X1.jpg',
  avatar: 'https://via.placeholder.com/80x80?text=User',

  // Brand-specific fallback images
  nike: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800',
  adidas: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800',
  converse: 'https://images.unsplash.com/photo-1514989771522-458c9b6c035a?w=800',
  vans: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800',
  puma: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329?w=800',
  newbalance: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=800',

  // Generic fallback images (7 variations)
  shoe_generic_1:
    'https://static.nike.com/a/images/t_PDP_1280_v1/f_auto,q_auto:eco/99486859-0ff3-46b4-949b-2d16af2ad421/custom-nike-air-max-90-by-you-shoes.png',
  shoe_generic_2:
    'https://assets.adidas.com/images/h_840,f_auto,q_auto,fl_lossy,c_fill,g_auto/fbaf991a78bc4896a3e9ad7800abcec6_9366/Ultraboost_Light_Shoes_Black_GY9350_01_standard.jpg',
  shoe_generic_3:
    'https://images.puma.com/image/upload/f_auto,q_auto,b_rgb:fafafa,w_2000,h_2000/global/374915/01/sv01/fnd/PNA/fmt/png/Suede-Classic-XXI-Sneakers',
  shoe_generic_4:
    'https://www.converse.com/dw/image/v2/BCZC_PRD/on/demandware.static/-/Sites-cnv-master-catalog/default/dw6f1c0e4d/images/a_107/M9160_A_107X1.jpg',
  shoe_generic_5: 'https://images.unsplash.com/photo-1543508282-6319a3e2621f?w=800',
  shoe_generic_6: 'https://nb.scene7.com/is/image/NB/ml574evb_nb_02_i',
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
