"use client"

import React, { useState } from 'react'
import { FiX, FiEye } from 'react-icons/fi'
import { useComparison } from '@/components/providers/ComparisonProvider'
import ProductComparison from '@/components/product/ProductComparison'
import './CompareBar.css'

const CompareBar = () => {
  const { compareList, removeFromCompare, clearCompare } = useComparison()
  const [showComparison, setShowComparison] = useState(false)

  const handleCompare = () => {
    if (compareList.length < 2) {
      alert('Vui lòng chọn ít nhất 2 sản phẩm để so sánh')
      return
    }
    setShowComparison(true)
  }

  if (compareList.length === 0) {
    return null
  }

  return (
    <>
      <div className="compare-bar">
        <div className="compare-bar-content">
          <div className="compare-info">
            <h3>So sánh sản phẩm ({compareList.length}/4)</h3>
            <button className="clear-all-btn" onClick={clearCompare}>
              Xóa tất cả
            </button>
          </div>

          <div className="compare-items">
            {compareList.map((product) => (
              <div key={product._id} className="compare-item">
                <img 
                  src={product.images?.[0] || '/images/placeholder-product.svg'} 
                  alt={product.name}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder-product.svg'
                  }}
                />
                <div className="item-info">
                  <p className="item-name">{product.name}</p>
                  <p className="item-brand">{product.brand}</p>
                </div>
                <button
                  className="remove-item-btn"
                  onClick={() => removeFromCompare(product._id)}
                  title="Xóa"
                >
                  <FiX />
                </button>
              </div>
            ))}

            {/* Empty slots */}
            {[...Array(4 - compareList.length)].map((_, i) => (
              <div key={`empty-${i}`} className="compare-item empty">
                <p>Thêm sản phẩm để so sánh</p>
              </div>
            ))}
          </div>

          <button
            className="compare-now-btn"
            onClick={handleCompare}
            disabled={compareList.length < 2}
          >
            <FiEye /> So sánh ngay
          </button>
        </div>
      </div>

      {showComparison && (
        <ProductComparison
          productIds={compareList.map((p) => p._id)}
          onClose={() => setShowComparison(false)}
        />
      )}
    </>
  )
}

export default CompareBar
