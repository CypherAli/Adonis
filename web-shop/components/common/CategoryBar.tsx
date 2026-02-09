"use client"

import React from 'react'
import './CategoryBar.css'

const brands = [
  { name: 'NIKE', icon: '👟', displayName: 'Nike' },
  { name: 'ADIDAS', icon: '⚡', displayName: 'Adidas' },
  { name: 'PUMA', icon: '🐆', displayName: 'Puma' },
  { name: 'REEBOK', icon: '💪', displayName: 'Reebok' },
  { name: 'NEW BALANCE', icon: '⚖️', displayName: 'New Balance' },
  { name: 'CONVERSE', icon: '⭐', displayName: 'Converse' },
  { name: 'VANS', icon: '🛹', displayName: 'Vans' },
]

interface CategoryBarProps {
  onBrandClick?: (brand: string) => void
  selectedBrand?: string
}

const CategoryBar = ({ onBrandClick, selectedBrand }: CategoryBarProps) => {
  const handleBrandClick = (brandName: string) => {
    // Scroll to products section
    const productsSection = document.querySelector('.homepage-container')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth' })
    }

    // Call parent handler if provided
    if (onBrandClick) {
      onBrandClick(brandName)
    }
  }

  return (
    <div className="category-bar-wrapper">
      <div className="category-bar">
        {brands.map((brand, index) => (
          <div
            key={index}
            className={`category-item ${selectedBrand === brand.displayName ? 'active' : ''}`}
            onClick={() => handleBrandClick(brand.displayName)}
            role="button"
            tabIndex={0}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleBrandClick(brand.displayName)
            }}
          >
            <div className="category-icon-wrapper">
              <span className="category-icon">{brand.icon}</span>
            </div>
            <div className="category-info">
              <span className="category-name">{brand.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CategoryBar
