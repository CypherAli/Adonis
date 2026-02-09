/**
 * API Utilities with proper caching for Next.js 15
 * Based on React Performance #1-4 and Next.js #13
 */

import { cache } from 'react'

// Next.js 15+ requires explicit cache configuration
const CACHE_CONFIG = {
  // Static data that rarely changes
  static: { cache: 'force-cache' as const, next: { revalidate: 3600 } },
  
  // Dynamic data that changes frequently
  dynamic: { cache: 'no-store' as const },
  
  // Revalidate every 5 minutes
  short: { cache: 'force-cache' as const, next: { revalidate: 300 } },
  
  // Revalidate every hour
  medium: { cache: 'force-cache' as const, next: { revalidate: 3600 } },
  
  // Revalidate daily
  long: { cache: 'force-cache' as const, next: { revalidate: 86400 } },
}

// Base fetch with error handling
async function baseFetch<T>(url: string, options?: RequestInit): Promise<T> {
  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    
    return await response.json()
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}

// React.cache for request deduplication (React Performance #11)
export const getCachedProducts = cache(async () => {
  return baseFetch('/api/products', CACHE_CONFIG.medium)
})

export const getCachedCategories = cache(async () => {
  return baseFetch('/api/categories', CACHE_CONFIG.long)
})

export const getCachedProduct = cache(async (id: string) => {
  return baseFetch(`/api/products/${id}`, CACHE_CONFIG.short)
})

// Dynamic data - no cache
export async function getUserCart(userId: string) {
  return baseFetch(`/api/cart/${userId}`, CACHE_CONFIG.dynamic)
}

export async function getUserOrders(userId: string) {
  return baseFetch(`/api/orders/${userId}`, CACHE_CONFIG.dynamic)
}

// Parallel fetching helper (React Performance #2)
export async function fetchParallel<T extends Record<string, () => Promise<any>>>(
  fetchers: T
): Promise<{ [K in keyof T]: Awaited<ReturnType<T[K]>> }> {
  const keys = Object.keys(fetchers) as (keyof T)[]
  const promises = keys.map((key) => fetchers[key]())
  const results = await Promise.all(promises)
  
  return keys.reduce((acc, key, index) => {
    acc[key] = results[index]
    return acc
  }, {} as any)
}

// Example usage of parallel fetching:
// const { products, categories, brands } = await fetchParallel({
//   products: () => getCachedProducts(),
//   categories: () => getCachedCategories(),
//   brands: () => getCachedBrands(),
// })

// Better-all pattern for dependent operations (React Performance #3)
export async function fetchWithDependencies<T extends Record<string, any>>(
  operations: {
    [K in keyof T]: (results: Partial<T>) => Promise<T[K]>
  }
): Promise<T> {
  const results: Partial<T> = {}
  const pending = new Map<keyof T, Promise<any>>()
  
  for (const [key, operation] of Object.entries(operations) as [keyof T, any][]) {
    const promise = operation(results).then((value: any) => {
      results[key] = value
      return value
    })
    pending.set(key, promise)
  }
  
  await Promise.all(pending.values())
  return results as T
}

// Example usage:
// const data = await fetchWithDependencies({
//   user: async () => fetchUser(),
//   config: async () => fetchConfig(),
//   profile: async (r) => {
//     await r.user // Wait for user to be ready
//     return fetchProfile(r.user.id)
//   }
// })

// LRU Cache for cross-request caching (React Performance #12)
class LRUCache<K, V> {
  private cache = new Map<K, { value: V; timestamp: number }>()
  private maxSize: number
  private ttl: number
  
  constructor(maxSize = 1000, ttlMs = 5 * 60 * 1000) {
    this.maxSize = maxSize
    this.ttl = ttlMs
  }
  
  get(key: K): V | undefined {
    const entry = this.cache.get(key)
    if (!entry) return undefined
    
    if (Date.now() - entry.timestamp > this.ttl) {
      this.cache.delete(key)
      return undefined
    }
    
    // Move to end (most recently used)
    this.cache.delete(key)
    this.cache.set(key, entry)
    return entry.value
  }
  
  set(key: K, value: V): void {
    if (this.cache.size >= this.maxSize) {
      // Delete oldest (first) entry
      const firstKey = this.cache.keys().next().value as K | undefined
      if (firstKey !== undefined) {
        this.cache.delete(firstKey)
      }
    }
    
    this.cache.set(key, { value, timestamp: Date.now() })
  }
  
  has(key: K): boolean {
    return this.get(key) !== undefined
  }
  
  clear(): void {
    this.cache.clear()
  }
}

// Global LRU cache instance
export const globalCache = new LRUCache<string, any>(1000, 5 * 60 * 1000)

// Cached fetch with LRU
export async function cachedFetch<T>(url: string, options?: RequestInit): Promise<T> {
  const cacheKey = `${url}-${JSON.stringify(options)}`
  
  if (globalCache.has(cacheKey)) {
    return globalCache.get(cacheKey)!
  }
  
  const data = await baseFetch<T>(url, options)
  globalCache.set(cacheKey, data)
  return data
}
