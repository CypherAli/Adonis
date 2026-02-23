/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client and utilities
export { default as apiClient, clearApiCache, clearCacheForUrl, API_BASE_URL } from './api_client'

// Export product services (client-side, axios)
export * from './products'

// Export news services
export * from './news'

// Export types
export type { BackendProduct, FrontendProduct, ProductFilters, ProductVariant } from '@/types/product.types'
