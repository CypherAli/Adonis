/**
 * Products API Service
 * All product-related API calls
 */

import apiClient from './api_client'
import type { BackendProduct, ProductFilters } from '@/types/product.types'

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

interface ProductsResponse {
  data: BackendProduct[]
  total: number
  page: number
  limit: number
}

interface ProductResponse {
  data: BackendProduct
}

// ============================================================================
// PRODUCTS API
// ============================================================================

/**
 * Fetch products with filters
 */
export async function getProducts(filters?: ProductFilters): Promise<ProductsResponse> {
  const response = await apiClient.get<ProductsResponse>('/products', { params: filters })
  return response.data
}

/**
 * Fetch single product by ID or slug
 */
export async function getProduct(idOrSlug: string): Promise<BackendProduct> {
  const response = await apiClient.get<ProductResponse>(`/products/${idOrSlug}`)
  return response.data.data || response.data
}

/**
 * Fetch best sellers
 */
export async function getBestSellers(limit = 10): Promise<BackendProduct[]> {
  const response = await apiClient.get<ProductsResponse>('/products/best-sellers', {
    params: { limit },
  })
  return response.data.data || response.data
}

/**
 * Fetch featured products
 */
export async function getFeaturedProducts(limit = 10): Promise<BackendProduct[]> {
  const response = await apiClient.get<ProductsResponse>('/products/featured', {
    params: { limit },
  })
  return response.data.data || response.data
}

/**
 * Fetch new arrivals
 */
export async function getNewArrivals(limit = 10): Promise<BackendProduct[]> {
  const response = await apiClient.get<ProductsResponse>('/products/new-arrivals', {
    params: { limit },
  })
  return response.data.data || response.data
}

/**
 * Fetch deals/discounted products
 */
export async function getDeals(limit = 20): Promise<BackendProduct[]> {
  const response = await apiClient.get<ProductsResponse>('/products/deals', {
    params: { limit },
  })
  return response.data.data || response.data
}

/**
 * Fetch related products
 */
export async function getRelatedProducts(productId: string, limit = 4): Promise<BackendProduct[]> {
  const response = await apiClient.get<ProductsResponse>(`/products/${productId}/related`, {
    params: { limit },
  })
  return response.data.data || response.data
}

/**
 * Search products
 */
export async function searchProducts(query: string, limit = 20): Promise<BackendProduct[]> {
  const response = await apiClient.get<ProductsResponse>('/products/search', {
    params: { q: query, limit },
  })
  return response.data.data || response.data
}
