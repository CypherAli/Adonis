// Performance mode configuration
export const PERFORMANCE_CONFIG = {
  // Enable/disable animations
  ENABLE_ANIMATIONS: process.env.NODE_ENV === 'development' ? false : true,

  // API caching
  API_CACHE_ENABLED: true,
  API_CACHE_DURATION: 30000, // 30 seconds

  // Image optimization
  IMAGE_QUALITY: 75,
  IMAGE_LOADING: 'lazy' as const,

  // Prefetching
  PREFETCH_ENABLED: true,
  PREFETCH_ON_HOVER: true,

  // Debounce delays
  SEARCH_DEBOUNCE: 300,
  SCROLL_THROTTLE: 100,
  RESIZE_THROTTLE: 150,

  // Request optimization
  REQUEST_TIMEOUT: 10000,
  MAX_RETRIES: 2,

  // Bundle optimization
  CODE_SPLITTING: true,
  LAZY_LOAD_ROUTES: true,
}

// Detect slow connection
export const isSlowConnection = (): boolean => {
  if (typeof navigator === 'undefined') return false

  const connection =
    (navigator as any).connection ||
    (navigator as any).mozConnection ||
    (navigator as any).webkitConnection

  if (!connection) return false

  return (
    connection.effectiveType === 'slow-2g' ||
    connection.effectiveType === '2g' ||
    connection.saveData === true
  )
}

// Detect low-end device
export const isLowEndDevice = (): boolean => {
  if (typeof navigator === 'undefined') return false

  const memory = (navigator as any).deviceMemory
  const cores = navigator.hardwareConcurrency

  return (memory && memory < 4) || (cores && cores < 4)
}

// Get optimal config based on device/network
export const getOptimalConfig = () => {
  const slowConnection = isSlowConnection()
  const lowEndDevice = isLowEndDevice()

  if (slowConnection || lowEndDevice) {
    return {
      ...PERFORMANCE_CONFIG,
      ENABLE_ANIMATIONS: false,
      IMAGE_QUALITY: 60,
      API_CACHE_DURATION: 60000, // 1 minute
      PREFETCH_ON_HOVER: false,
    }
  }

  return PERFORMANCE_CONFIG
}
