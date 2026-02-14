'use client'

import { useState } from 'react'
import { FaFilter, FaTimes } from 'react-icons/fa'

interface FiltersProps {
  filters: {
    search: string
    brand: string
    minPrice: string
    maxPrice: string
    sortBy: string
  }
  setFilters: React.Dispatch<React.SetStateAction<{
    search: string
    brand: string
    minPrice: string
    maxPrice: string
    sortBy: string
  }>>
}

export default function ProductFilters({ filters, setFilters }: FiltersProps) {
  const [showFilters, setShowFilters] = useState(false)

  const brands = ['Nike', 'Adidas', 'Puma', 'Converse', 'Vans', 'New Balance']

  const handleBrandToggle = (brand: string) => {
    setFilters(prev => ({ ...prev, brand: prev.brand === brand ? '' : brand }))
  }

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') {
      setFilters(prev => ({ ...prev, minPrice: value }))
    } else {
      setFilters(prev => ({ ...prev, maxPrice: value }))
    }
  }

  const handleClearFilters = () => {
    setFilters({
      search: '',
      brand: '',
      minPrice: '',
      maxPrice: '',
      sortBy: '',
    })
  }

  return (
    <>
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg mb-4"
      >
        <FaFilter /> Bộ Lọc
      </button>

      <div
        className={`${
          showFilters ? 'block' : 'hidden'
        } lg:block bg-white rounded-xl shadow-md p-6`}
      >
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold">Bộ Lọc</h3>
          <button
            onClick={handleClearFilters}
            className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <FaTimes /> Xóa
          </button>
        </div>

        {/* Brand Filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Thương Hiệu</h4>
          <div className="space-y-2">
            {brands.map((brand) => (
              <label key={brand} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.brand === brand}
                  onChange={() => handleBrandToggle(brand)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3">Khoảng Giá</h4>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-gray-600">Từ</label>
              <input
                type="number"
                value={filters.minPrice}
                onChange={(e) => handlePriceChange('min', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="0"
              />
            </div>
            <div>
              <label className="text-sm text-gray-600">Đến</label>
              <input
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handlePriceChange('max', e.target.value)}
                className="w-full px-3 py-2 border rounded-lg"
                placeholder="5,000,000"
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
