/**
 * Performance optimization utilities
 */

// Debounce function for search, scroll, resize events
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }

    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

// Throttle function for frequent events
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean = false

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// Lazy load images
export function lazyLoadImage(img: HTMLImageElement) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const image = entry.target as HTMLImageElement
        const src = image.getAttribute('data-src')
        if (src) {
          image.src = src
          image.removeAttribute('data-src')
        }
        observer.unobserve(image)
      }
    })
  })

  observer.observe(img)
}

// Prefetch route
export function prefetchRoute(url: string) {
  const link = document.createElement('link')
  link.rel = 'prefetch'
  link.href = url
  document.head.appendChild(link)
}

// Measure page load time
export function measurePageLoad() {
  if (typeof window !== 'undefined' && window.performance) {
    const perfData = window.performance.timing
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart
    console.log(`Page load time: ${pageLoadTime}ms`)
    return pageLoadTime
  }
  return 0
}
