'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import FilterSidebar from '../sidebar/FilterSidebar'
import { mapProducts } from '@/lib/utils/product_mapper'
import type { FrontendProduct } from '@/types/product.types'

interface ProductGridProps {
  initialProducts: FrontendProduct[]
  initialTotal: number
  initialPage: number
  initialTotalPages: number
}

interface Filters {
  searchQuery: string
  brands: string[]
  sizes: string[]
  colors: string[]
  materials: string[]
  minPrice: string
  maxPrice: string
  inStock: boolean
  sortBy: string
}

const PRODUCTS_PER_PAGE = 20

export default function ProductGrid({
  initialProducts,
  initialTotal,
  initialPage,
  initialTotalPages,
}: ProductGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<FrontendProduct[]>(initialProducts)
  const [total, setTotal] = useState(initialTotal)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [totalPages, setTotalPages] = useState(initialTotalPages)
  const [loading, setLoading] = useState(false)

  const [filters, setFilters] = useState<Filters>({
    searchQuery: searchParams.get('search') || '',
    brands: searchParams.get('brand') ? [searchParams.get('brand')!] : [],
    sizes: [],
    colors: [],
    materials: [],
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    inStock: false,
    sortBy: searchParams.get('sortBy') || '',
  })

  const [tempFilters, setTempFilters] = useState<Filters>(filters)

  // Extract unique brands from initial data
  const brands = Array.from(new Set(initialProducts.map(p => p.brand).filter(Boolean)))
  const sizeOptions = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  const colorOptions = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Vàng', 'Xám', 'Nâu', 'Hồng']
  const materialOptions = ['Da', 'Canvas', 'Mesh', 'Vải', 'Synthetic']

  const activeFiltersCount =
    (filters.searchQuery ? 1 : 0) +
    filters.brands.length +
    filters.sizes.length +
    filters.colors.length +
    filters.materials.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.inStock ? 1 : 0)

  // Fetch products from API with server-side filters & pagination
  const fetchProducts = useCallback(async (page: number, appliedFilters: Filters) => {
    try {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(PRODUCTS_PER_PAGE))

      if (appliedFilters.searchQuery) params.set('search', appliedFilters.searchQuery)
      if (appliedFilters.brands.length > 0) params.set('brand', appliedFilters.brands[0])
      if (appliedFilters.minPrice) params.set('minPrice', appliedFilters.minPrice)
      if (appliedFilters.maxPrice) params.set('maxPrice', appliedFilters.maxPrice)

      if (appliedFilters.sortBy === 'price_asc') {
        params.set('sortBy', 'basePrice')
        params.set('sortOrder', 'asc')
      } else if (appliedFilters.sortBy === 'price_desc') {
        params.set('sortBy', 'basePrice')
        params.set('sortOrder', 'desc')
      } else if (appliedFilters.sortBy === 'popularity') {
        params.set('sortBy', 'soldCount')
        params.set('sortOrder', 'desc')
      }

      const res = await fetch(`${API_URL}/api/products?${params.toString()}`)
      if (!res.ok) throw new Error('API error')

      const data = await res.json()
      const mapped = mapProducts(data.products || [])

      // Client-side filters for attributes not supported by API
      let filtered = mapped
      if (appliedFilters.inStock) {
        filtered = filtered.filter(p => p.stock > 0)
      }

      setProducts(filtered)
      setTotal(data.pagination?.total || data.totalProducts || 0)
      setCurrentPage(data.pagination?.page || page)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchProducts(page, filters)
  }

  // Handle filter apply
  const handleApplyFilters = () => {
    setFilters(tempFilters)
    fetchProducts(1, tempFilters)
  }

  const handleClearFilters = () => {
    const emptyFilters: Filters = {
      searchQuery: '',
      brands: [],
      sizes: [],
      colors: [],
      materials: [],
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: '',
    }
    setTempFilters(emptyFilters)
    setFilters(emptyFilters)
    fetchProducts(1, emptyFilters)
  }

  const handleTempFilterChange = (filterName: string, value: any) => {
    setTempFilters(prev => ({ ...prev, [filterName]: value }))
  }

  const toggleArrayFilter = (filterName: string, value: string) => {
    setTempFilters(prev => {
      const currentArray = prev[filterName as keyof Filters] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [filterName]: newArray }
    })
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  // Generate pagination range
  const getPaginationRange = () => {
    const range: (number | string)[] = []
    const maxVisible = 5

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) range.push(i)
    } else {
      range.push(1)
      if (currentPage > 3) range.push('...')

      const start = Math.max(2, currentPage - 1)
      const end = Math.min(totalPages - 1, currentPage + 1)
      for (let i = start; i <= end; i++) range.push(i)

      if (currentPage < totalPages - 2) range.push('...')
      range.push(totalPages)
    }
    return range
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters */}
      <div className="lg:col-span-1">
        <FilterSidebar
          tempFilters={tempFilters}
          handleTempFilterChange={handleTempFilterChange}
          toggleArrayFilter={toggleArrayFilter}
          handleApplyFilters={handleApplyFilters}
          handleClearFilters={handleClearFilters}
          handleKeyPress={handleKeyPress}
          brands={brands}
          sizeOptions={sizeOptions}
          colorOptions={colorOptions}
          materialOptions={materialOptions}
          activeFiltersCount={activeFiltersCount}
        />
      </div>

      {/* Product Grid */}
      <div className="lg:col-span-3">
        {/* Results count & sort info */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Hiển thị <strong>{products.length}</strong> / {total} sản phẩm
            {totalPages > 1 && (
              <span className="text-sm ml-2">(Trang {currentPage}/{totalPages})</span>
            )}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
              Không tìm thấy sản phẩm nào
            </p>
            <button
              onClick={handleClearFilters}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}

        {/* Products */}
        {!loading && products.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <nav className="mt-10 flex justify-center" aria-label="Pagination">
                <ul className="flex items-center gap-1">
                  {/* Previous */}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage <= 1}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        disabled:opacity-40 disabled:cursor-not-allowed
                        hover:bg-gray-100 text-gray-700"
                      aria-label="Previous page"
                    >
                      ← Trước
                    </button>
                  </li>

                  {/* Page numbers */}
                  {getPaginationRange().map((item, idx) =>
                    item === '...' ? (
                      <li key={`ellipsis-${idx}`}>
                        <span className="px-2 py-2 text-gray-400">...</span>
                      </li>
                    ) : (
                      <li key={item}>
                        <button
                          onClick={() => handlePageChange(item as number)}
                          className={`min-w-[40px] h-[40px] rounded-lg text-sm font-medium transition-colors
                            ${currentPage === item
                              ? 'bg-blue-600 text-white shadow-md'
                              : 'hover:bg-gray-100 text-gray-700'
                            }`}
                        >
                          {item}
                        </button>
                      </li>
                    )
                  )}

                  {/* Next */}
                  <li>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                      className="px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        disabled:opacity-40 disabled:cursor-not-allowed
                        hover:bg-gray-100 text-gray-700"
                      aria-label="Next page"
                    >
                      Sau →
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>
    </div>
  )
}
