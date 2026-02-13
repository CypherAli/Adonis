/**
 * API Services Index
 * Central export point for all API services
 */

// Export API client and utilities
export { default as apiClient, clearApiCache, clearCacheForUrl, API_BASE_URL } from './api_client'

// Export product services
export * from './products'

// Export types
export type { BackendProduct, FrontendProduct, ProductFilters, ProductVariant } from '@/types/product.types'
