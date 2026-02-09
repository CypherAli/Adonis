// Suppress XHR 401/403/400 logs and image 404s in development
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const originalConsoleError = console.error
  console.error = (...args: any[]) => {
    // Filter out XHR errors
    const errorString = args.join(' ')
    
    // Suppress 401/403/400 API errors for protected endpoints
    if (
      errorString.includes('401') ||
      errorString.includes('Unauthorized') ||
      errorString.includes('403') ||
      errorString.includes('Forbidden') ||
      errorString.includes('400') ||
      errorString.includes('Bad Request') ||
      errorString.includes('Token không hợp lệ') ||
      errorString.includes('hết hạn')
    ) {
      // Check if it's from our API endpoints
      if (
        errorString.includes('/api/cart') ||
        errorString.includes('/api/user/wishlist') ||
        errorString.includes('/api/orders') ||
        errorString.includes('/api/auth/me') ||
        errorString.includes('/api/auth/session') ||
        errorString.includes('POST http://localhost:3333/api/orders')
      ) {
        return // Suppress this log
      }
    }
    
    // Suppress image 404 errors (already handled by onError)
    if (
      errorString.includes('404') &&
      (errorString.includes('.jpg') ||
        errorString.includes('.png') ||
        errorString.includes('.webp') ||
        errorString.includes('.jpeg') ||
        errorString.includes('.svg') ||
        errorString.includes('adidas.com') ||
        errorString.includes('assets.') ||
        errorString.includes('images/') ||
        errorString.includes('Ultraboost') ||
        errorString.includes('GZ0127') ||
        errorString.includes('GY9350') ||
        errorString.includes('GZ7925'))
    ) {
      return // Suppress image 404s
    }
    
    originalConsoleError(...args)
  }
}

export {}
