"use client"

import React from 'react'
import { useTheme } from '@/components/providers/ThemeProvider'
import { FiSun, FiMoon } from 'react-icons/fi'
import './ThemeToggle.css'

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      className="theme-toggle-btn"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="theme-toggle-icon-wrapper">
        {theme === 'light' ? (
          <FiMoon className="theme-toggle-icon" />
        ) : (
          <FiSun className="theme-toggle-icon" />
        )}
      </div>
    </button>
  )
}

export default ThemeToggle
