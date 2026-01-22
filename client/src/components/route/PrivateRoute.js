import React, { useContext } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'

/**
 * PrivateRoute Component
 * Protects routes based on authentication and role
 * @param {Array} allowedRoles - Array of roles allowed to access this route
 * @param {Boolean} requireApproval - Whether partner accounts need approval (default: false)
 */
const PrivateRoute = ({ allowedRoles, requireApproval = false }) => {
  const { user } = useContext(AuthContext)

  // 1. Check if user is logged in
  if (!user) {
    // Save current path before redirecting
    localStorage.setItem('redirectAfterLogin', window.location.pathname)
    return <Navigate to="/login" replace />
  }

  // 2. Check if user has the required role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Unauthorized - redirect to home
    return <Navigate to="/" replace />
  }

  // 3. For partner-specific routes, check approval status if required
  // Note: We allow unapproved partners to access but components should show limitations
  if (requireApproval && user.role === 'partner' && !user.isApproved) {
    console.log('⚠️ Partner not approved - limited access')
  }

  // 4. Allow access
  return <Outlet />
}

export default PrivateRoute
