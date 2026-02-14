/**
 * Unified API Client
 * Single source of truth for all API calls with optimizations
 */

import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'
import { getSession } from 'next-auth/react'

// ============================================================================
// CONFIGURATION
// ============================================================================

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
const REQUEST_TIMEOUT = 30000 // 30 seconds
const CACHE_DURATION = 30000 // 30 seconds for GET requests

// ============================================================================
// CACHE MANAGEMENT
// ============================================================================

interface CacheEntry {
  data: any
  timestamp: number
}

const requestCache = new Map<string, CacheEntry>()
const pendingRequests = new Map<string, Promise<any>>()

/**
 * Generate cache key from URL and params
 */
function getCacheKey(url: string, params?: any): string {
  return `${url}${params ? JSON.stringify(params) : ''}`
}

/**
 * Clear all cached requests
 */
export function clearApiCache(): void {
  requestCache.clear()
  pendingRequests.clear()
}

/**
 * Clear cache for specific URL pattern
 */
export function clearCacheForUrl(urlPattern: string): void {
  for (const key of requestCache.keys()) {
    if (key.startsWith(urlPattern)) {
      requestCache.delete(key)
      pendingRequests.delete(key)
    }
  }
}

// ============================================================================
// AXIOS INSTANCE
// ============================================================================

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: REQUEST_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
  validateStatus: (status) => status < 500, // Don't throw on 4xx errors
})

// ============================================================================
// REQUEST INTERCEPTOR
// ============================================================================

apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Add authentication token (skip if already provided in headers)
    if (typeof window !== 'undefined' && config.headers && !config.headers.Authorization) {
      try {
        const session = await getSession()
        if (session?.accessToken) {
          config.headers.Authorization = `Bearer ${session.accessToken}`
        }
      } catch (error) {
        // Silently ignore session errors - the request can continue without auth
        console.warn('Failed to get session for API request:', error)
      }
    }

    // Handle caching for GET requests
    if (config.method === 'get' && config.url) {
      const cacheKey = getCacheKey(config.url, config.params)
      
      // Check cache
      const cached = requestCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        // Return cached data
        config.adapter = () =>
          Promise.resolve({
            data: cached.data,
            status: 200,
            statusText: 'OK (cached)',
            headers: {},
            config,
          })
        return config
      }

      // Check for pending duplicate requests
      const pending = pendingRequests.get(cacheKey)
      if (pending) {
        config.adapter = () =>
          pending.then((data) => ({
            data,
            status: 200,
            statusText: 'OK (deduped)',
            headers: {},
            config,
          }))
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// ============================================================================
// RESPONSE INTERCEPTOR
// ============================================================================

apiClient.interceptors.response.use(
  (response) => {
    // Cache successful GET responses
    if (response.config.method === 'get' && response.config.url && response.status === 200) {
      const cacheKey = getCacheKey(response.config.url, response.config.params)
      requestCache.set(cacheKey, {
        data: response.data,
        timestamp: Date.now(),
      })
      pendingRequests.delete(cacheKey)
    }

    // Handle 401/403 errors
    if (response.status === 401 || response.status === 403) {
      handleAuthError(response.data?.message)
      return Promise.reject({
        response,
        message: 'Unauthorized',
      })
    }

    return response
  },
  async (error: AxiosError<{ message?: string }>) => {
    // Handle authentication errors
    if (error.response?.status === 401 || error.response?.status === 403) {
      handleAuthError(error.response?.data?.message)
    }

    // Only log 5xx errors in development
    if (
      error.response?.status &&
      error.response.status >= 500 &&
      process.env.NODE_ENV === 'development'
    ) {
      console.error(
        'API Error:',
        error.response.status,
        error.response.data?.message || error.message
      )
    }

    return Promise.reject(error)
  }
)

// ============================================================================
// ERROR HANDLERS
// ============================================================================

/**
 * Handle authentication errors
 */
function handleAuthError(errorMessage?: string): void {
  if (typeof window === 'undefined') return

  const message = errorMessage || ''
  const isExpired =
    message.includes('Token không hợp lệ') ||
    message.includes('hết hạn') ||
    message.includes('expired')

  if (isExpired) {
    // Auto logout on expired token
    import('next-auth/react').then(({ signOut }) => {
      signOut({ callbackUrl: '/auth/login?expired=true', redirect: true })
    })
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default apiClient
export { API_BASE_URL }
