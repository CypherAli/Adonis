/**
 * Map backend product data to frontend format
 */
import { getBrandImage, getRandomShoeImage } from './placeholder_images'
import type { BackendProduct, FrontendProduct } from '@/types/product.types'

// Re-export types for backward compatibility
export type { BackendProduct, FrontendProduct } from '@/types/product.types'

export function mapProduct(backendProduct: BackendProduct): FrontendProduct {
  // Calculate total stock from variants
  const totalStock = backendProduct.variants.reduce((sum, v) => sum + v.stock, 0)

  // Get lowest price from variants
  const lowestPrice = Math.min(...backendProduct.variants.map((v) => v.price))
  const lowestOriginalPrice = Math.min(...backendProduct.variants.map((v) => v.originalPrice))

  // Get first available image or use brand-specific placeholder
  let image = backendProduct.images[0] || ''
  if (!image || backendProduct.images.length === 0) {
    // Use brand-specific placeholder
    image = backendProduct.brand ? getBrandImage(backendProduct.brand) : getRandomShoeImage()
  }

  return {
    id: backendProduct._id,
    name: backendProduct.name,
    price: lowestPrice,
    originalPrice: lowestOriginalPrice !== lowestPrice ? lowestOriginalPrice : undefined,
    image,
    brand: backendProduct.brand,
    rating: backendProduct.rating.average,
    reviewCount: backendProduct.rating.count,
    category: backendProduct.category,
    description: backendProduct.description,
    stock: totalStock,
    soldCount: backendProduct.soldCount || 0,
  }
}

export function mapProducts(backendProducts: BackendProduct[]): FrontendProduct[] {
  return backendProducts.map(mapProduct)
}
