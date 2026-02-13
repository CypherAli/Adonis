/**
 * Image Helper Functions
 * Xử lý URL ảnh từ backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

/**
 * Convert avatar path from backend to full URL
 * @param {string} avatarPath - Path từ backend (e.g., "/uploads/avatars/filename.jpg")
 * @returns {string} - Full URL hoặc null
 */
export const getAvatarUrl = (avatarPath: string | null | undefined): string | null => {
  if (!avatarPath) return null

  // Nếu đã là full URL (http/https), return luôn
  if (avatarPath.startsWith('http://') || avatarPath.startsWith('https://')) {
    return avatarPath
  }

  // Nếu là relative path từ backend
  if (avatarPath.startsWith('/uploads')) {
    const fullUrl = `${API_BASE_URL}${avatarPath}`
    return fullUrl
  }

  // Fallback
  return avatarPath
}

/**
 * Convert product image path from backend to full URL
 * @param {string} imagePath - Path từ backend
 * @returns {string} - Full URL hoặc null
 */
export const getProductImageUrl = (imagePath: string | null | undefined): string | null => {
  if (!imagePath) return null

  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath
  }

  if (imagePath.startsWith('/uploads')) {
    return `${API_BASE_URL}${imagePath}`
  }

  return imagePath
}
