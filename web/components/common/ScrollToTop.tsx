"use client"

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

/**
 * ScrollToTop Component
 * Tự động scroll về đầu trang (hoặc giữa) mỗi khi route thay đổi
 * Cải thiện UX khi người dùng điều hướng giữa các trang
 */
const ScrollToTop = () => {
  const pathname = usePathname()

  useEffect(() => {
    // Respect user's motion preference (UX Guideline #85: Reduced Motion)
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Scroll về đầu trang với smooth animation (if user allows)
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }, [pathname]) // Chạy mỗi khi pathname thay đổi

  return null // Component này không render gì cả
}

export default ScrollToTop
