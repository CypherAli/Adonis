/**
 * Centralized Product Type Definitions
 * Single source of truth for all product-related types
 */

// ============================================================================
// BACKEND PRODUCT TYPES (from API)
// ============================================================================

export interface BackendProductVariant {
  _id: string
  variantName: string
  sku: string
  price: number
  originalPrice: number
  stock: number
  specifications?: string
  isAvailable: boolean
}

export interface BackendProduct {
  _id: string
  name: string
  description: string
  brand: string
  category: string
  basePrice: number
  variants: BackendProductVariant[]
  images: string[]
  rating: {
    average: number
    count: number
  }
  soldCount: number
  isFeatured: boolean
  slug: string
  createdAt?: string
  updatedAt?: string
}

// ============================================================================
// FRONTEND PRODUCT TYPES (for UI components)
// ============================================================================

export interface FrontendProduct {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  brand: string
  rating: number
  reviewCount: number
  category: string
  description: string
  stock: number
  soldCount: number
  slug?: string
}

// ============================================================================
// PRODUCT FILTER TYPES
// ============================================================================

export interface ProductFilters {
  searchQuery?: string
  search?: string
  brands?: string[]
  categories?: string[]
  sizes?: string[]
  colors?: string[]
  materials?: string[]
  minPrice?: number | string
  maxPrice?: number | string
  inStock?: boolean
  sortBy?: string
  page?: number
  limit?: number
}

// ============================================================================
// PRODUCT VARIANT TYPES (for product details)
// ============================================================================

export interface ProductVariant {
  id?: string
  _id?: string
  productId?: string
  variantName?: string
  sku?: string
  price: number
  originalPrice?: number
  stock: number
  size?: string
  color?: string
  gender?: string
  material?: string
  specifications?: {
    size?: string
    color?: string
    gender?: string
    material?: string
  }
  isAvailable?: boolean
}

// ============================================================================
// LEGACY PRODUCT TYPE (for backward compatibility - to be phased out)
// ============================================================================

/**
 * @deprecated Use FrontendProduct or BackendProduct instead
 * This type exists for backward compatibility only
 */
export interface Product {
  id: string
  _id?: string
  name: string
  description?: string
  brand?: string
  price?: number
  basePrice?: number
  originalPrice?: number
  salePrice?: number
  imageUrl?: string
  images?: string[]
  image?: string
  stock?: number
  totalStock?: number
  variants?: ProductVariant[]
  createdBy?: {
    shopName: string
  }
  category?: string
  rating?: number
  reviews?: number
  reviewCount?: number
  size?: string
  color?: string
  material?: string
  isSale?: boolean
  salePercent?: number
  isNew?: boolean
  features?: string[]
  slug?: string
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export function isBackendProduct(product: any): product is BackendProduct {
  return (
    product &&
    typeof product === 'object' &&
    '_id' in product &&
    'variants' in product &&
    Array.isArray(product.variants)
  )
}

export function isFrontendProduct(product: any): product is FrontendProduct {
  return (
    product &&
    typeof product === 'object' &&
    'id' in product &&
    'stock' in product &&
    !('variants' in product)
  )
}
