import React, { useContext } from 'react'
import AuthContext from '../../context/AuthContext'
import './RoleBasedLayout.css'

/**
 * RoleBasedLayout Component
 * Tự động apply theme và layout khác nhau dựa trên role của user
 */
const RoleBasedLayout = ({ children }) => {
  const { user } = useContext(AuthContext)

  // Xác định role theme
  const getRoleClass = () => {
    if (!user) return 'theme-guest'

    switch (user.role) {
      case 'admin':
        return 'theme-admin'
      case 'partner':
        return 'theme-partner'
      case 'client':
        return 'theme-client'
      default:
        return 'theme-guest'
    }
  }

  return <div className={`role-based-layout ${getRoleClass()}`}>{children}</div>
}

export default RoleBasedLayout
