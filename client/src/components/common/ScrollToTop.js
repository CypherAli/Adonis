import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/**
 * ScrollToTop Component
 * Tự động scroll về đầu trang (hoặc giữa) mỗi khi route thay đổi
 * Cải thiện UX khi người dùng điều hướng giữa các trang
 */
const ScrollToTop = () => {
  const { pathname } = useLocation()

  useEffect(() => {
    // Scroll về đầu trang với smooth animation
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })

    // Alternative: Scroll to top without animation (instant)
    // window.scrollTo(0, 0);
  }, [pathname]) // Chạy mỗi khi pathname thay đổi

  return null // Component này không render gì cả
}

export default ScrollToTop
