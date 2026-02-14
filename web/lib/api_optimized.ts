/**
 * @deprecated This file is deprecated. Use '@/lib/api' or '@/lib/api/api-client' instead
 * The optimization features from this file have been merged into the unified API client
 */

// Re-export the unified API client which includes all optimizations
export { default } from './api/api_client'
export { clearApiCache, clearCacheForUrl, API_BASE_URL } from './api/api_client'
