'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCart } from '@/components/providers/CartProvider'
import { useWishlist } from '@/components/providers/WishlistProvider'

const Header = () => {
  const { data: session } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams?.get('search') || '')
  const [theme, setTheme] = useState('light')
  
  const { cartItems, cartCount } = useCart()
  const { wishlistCount } = useWishlist()
  
  const user = session?.user

  const handleLogout = () => {
    signOut({ callbackUrl: '/auth/login' })
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  return (
    <>
      {/* Main Header */}
      <nav className="main-header">
        <div className="nav-container">
          <div className="nav-left">
            <Link href="/" className="logo">
              <div className="logo-icon-wrapper">
                <span className="logo-emoji">👟</span>
              </div>
              <div className="logo-text-wrapper">
                <span className="logo-text">SHOE STORE</span>
                <span className="logo-tagline">PREMIUM QUALITY</span>
              </div>
            </Link>

            {/* Hotline Prominent */}
            <a href="tel:0848565650" className="hotline-prominent">
              <span className="hotline-icon">📞</span>
              <div className="hotline-info">
                <span className="hotline-label">Hotline</span>
                <span className="hotline-number">084.856.5650</span>
              </div>
            </a>
          </div>

          {/* Center Search Bar */}
          <div className="nav-center">
            <form className="header-search" onSubmit={handleSearch}>
              <input
                type="text"
                placeholder="Tìm giày, phụ kiện..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="header-search-input"
              />
              <button type="submit" className="header-search-btn">
                🔍
              </button>
            </form>
          </div>

          <div className="nav-right">
            {/* Theme Toggle Button */}
            <button onClick={toggleTheme} className="icon-link" title="Toggle Theme">
              <span className="icon">{theme === 'light' ? '🌙' : '☀️'}</span>
              <span className="icon-label">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>

            {user ? (
              <>
                {/* Notifications */}
                <button className="icon-link" title="Notifications">
                  <span className="icon">🔔</span>
                  <span className="icon-label">Thông báo</span>
                </button>

                {/* Wishlist & Cart - Only for client */}
                {(!user.role || user.role === 'client') && (
                  <>
                    <Link href="/wishlist" className="icon-link">
                      <span className="icon">❤️</span>
                      <span className="icon-label">Wishlist</span>
                      {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
                    </Link>
                    <Link href="/cart" className="icon-link">
                      <span className="icon">🛒</span>
                      <span className="icon-label">Cart</span>
                      {cartCount > 0 && <span className="icon-badge cart-badge">{cartCount}</span>}
                    </Link>
                  </>
                )}

                {/* User Dropdown */}
                <div className="user-menu">
                  <button className="user-menu-btn">
                    {user.image ? (
                      <img src={user.image} alt={user.name || ''} className="user-avatar-small" />
                    ) : (
                      <span className="user-icon">👤</span>
                    )}
                    <span className="user-name">{user.name || user.email}</span>
                    <span className="dropdown-arrow">▼</span>
                  </button>
                  <div className="user-dropdown">
                    <Link href="/user/profile" className="dropdown-item">
                      👤 My Profile
                    </Link>
                    {(!user.role || user.role === 'client') && (
                      <>
                        <Link href="/user/orders" className="dropdown-item">
                          📦 My Orders
                        </Link>
                        <Link href="/user/settings" className="dropdown-item">
                          ⚙️ Settings
                        </Link>
                      </>
                    )}
                    {user.role === 'admin' && (
                      <>
                        <Link href="/admin" className="dropdown-item">
                          🎛️ Admin Dashboard
                        </Link>
                        <Link href="/admin/products/add" className="dropdown-item">
                          ➕ Add Product
                        </Link>
                      </>
                    )}
                    {user.role === 'partner' && (
                      <>
                        <Link href="/admin/products/add" className="dropdown-item">
                          ➕ Add Product
                        </Link>
                        <Link href="/partner/settings" className="dropdown-item">
                          ⚙️ Settings
                        </Link>
                        <Link href="/manager" className="dropdown-item">
                          📋 Product Management
                        </Link>
                      </>
                    )}
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      🚪 Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Wishlist & Cart for guests */}
                <Link href="/wishlist" className="icon-link">
                  <span className="icon">❤️</span>
                  <span className="icon-label">Wishlist</span>
                  {wishlistCount > 0 && <span className="icon-badge">{wishlistCount}</span>}
                </Link>
                <Link href="/cart" className="icon-link">
                  <span className="icon">🛒</span>
                  <span className="icon-label">Cart</span>
                  {cartCount > 0 && <span className="icon-badge cart-badge">{cartCount}</span>}
                </Link>

                {/* Login & Register */}
                <Link href="/auth/login" className="nav-link login-link">
                  🔐 Login
                </Link>
                <Link href="/auth/register" className="nav-link register-link">
                  📝 Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Navigation Menu */}
      <div className="main-nav">
        <div className="main-nav-container">
          <Link href="/" className="nav-menu-item">
            🏠 Home
          </Link>
          <Link href="/shop" className="nav-menu-item">
            👟 Products
          </Link>
          <Link href="/deals" className="nav-menu-item hot-item">
            🔥 Hot Deals
          </Link>
          <Link href="/best-sellers" className="nav-menu-item">
            ⭐ Best Sellers
          </Link>
          <Link href="/blog" className="nav-menu-item">
            📰 News & Reviews
          </Link>
          <Link href="/about" className="nav-menu-item">
            ℹ️ About Us
          </Link>
          <Link href="/contact" className="nav-menu-item">
            📞 Contact
          </Link>
        </div>
      </div>
    </>
  )
}

export default Header

