'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ProductCard from './ProductCard'
import FilterSidebar from '../sidebar/FilterSidebar'
import type { FrontendProduct } from '@/types/product.types'

interface ProductGridProps {
  initialProducts: FrontendProduct[]
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

/**
 * Product Grid - Client Component
 * Handle filters, search, sorting phía client với FilterSidebar đầy đủ
 */
export default function ProductGrid({ initialProducts }: ProductGridProps) {
  const [products] = useState<FrontendProduct[]>(initialProducts)
  const [filteredProducts, setFilteredProducts] = useState<FrontendProduct[]>(initialProducts)
  
  // Main filters state
  const [filters, setFilters] = useState<Filters>({
    searchQuery: '',
    brands: [],
    sizes: [],
    colors: [],
    materials: [],
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: '',
  })

  // Temporary filters (cho FilterSidebar)
  const [tempFilters, setTempFilters] = useState<Filters>(filters)

  // Extract unique values from products
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)))
  const sizeOptions = ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45']
  const colorOptions = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Vàng', 'Xám', 'Nâu', 'Hồng']
  const materialOptions = ['Da', 'Canvas', 'Mesh', 'Vải', 'Synthetic']

  // Count active filters
  const activeFiltersCount = 
    (filters.searchQuery ? 1 : 0) +
    filters.brands.length +
    filters.sizes.length +
    filters.colors.length +
    filters.materials.length +
    (filters.minPrice || filters.maxPrice ? 1 : 0) +
    (filters.inStock ? 1 : 0)

  // Apply filters
  useEffect(() => {
    let result = [...products]

<<<<<<< Updated upstream
    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase()
      result = result.filter((p) =>
        p.name.toLowerCase().includes(query) ||
        p.brand?.toLowerCase().includes(query)
      )
=======
      const params = new URLSearchParams()
      params.set('page', String(page))
      params.set('limit', String(PRODUCTS_PER_PAGE))

      if (appliedFilters.searchQuery) params.set('search', appliedFilters.searchQuery)
      if (appliedFilters.brands.length > 0) {
        // Send all selected brands as comma-separated
        params.set('brand', appliedFilters.brands.join(','))
      }
      if (appliedFilters.sizes.length > 0) params.set('size', appliedFilters.sizes.join(','))
      if (appliedFilters.colors.length > 0) params.set('color', appliedFilters.colors.join(','))
      if (appliedFilters.minPrice) params.set('minPrice', appliedFilters.minPrice)
      if (appliedFilters.maxPrice) params.set('maxPrice', appliedFilters.maxPrice)
      if (appliedFilters.inStock) params.set('inStock', 'true')

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

      setProducts(mapped)
      setTotal(data.pagination?.total || data.totalProducts || 0)
      setCurrentPage(data.pagination?.page || page)
      setTotalPages(data.pagination?.totalPages || 1)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
>>>>>>> Stashed changes
    }

<<<<<<< Updated upstream
    // Brand filter
    if (filters.brands.length > 0) {
      result = result.filter((p) => filters.brands.includes(p.brand))
    }

    // Price filter
    if (filters.minPrice) {
      result = result.filter((p) => p.price >= Number(filters.minPrice))
    }
    if (filters.maxPrice) {
      result = result.filter((p) => p.price <= Number(filters.maxPrice))
    }

    // In stock filter
    if (filters.inStock) {
      result = result.filter((p) => p.stock > 0)
    }

    // Sort
    if (filters.sortBy === 'price_asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (filters.sortBy === 'price_desc') {
      result.sort((a, b) => b.price - a.price)
    }

    setFilteredProducts(result)
  }, [filters, products])

  // Handle temp filter change
  const handleTempFilterChange = (filterName: string, value: any) => {
    setTempFilters(prev => ({ ...prev, [filterName]: value }))
  }

  // Toggle array filter (brands, sizes, colors, materials)
  const toggleArrayFilter = (filterName: string, value: string) => {
    setTempFilters(prev => {
      const currentArray = prev[filterName as keyof Filters] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value]
      return { ...prev, [filterName]: newArray }
    })
  }

  // Apply filters
  const handleApplyFilters = () => {
    setFilters(tempFilters)
=======
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    window.scrollTo({ top: 0, behavior: 'smooth' })
    fetchProducts(page, filters)
    syncFiltersToUrl(filters, page)
  }

  // Sync filters to URL for shareable links
  const syncFiltersToUrl = useCallback((appliedFilters: Filters, page: number) => {
    const params = new URLSearchParams()
    if (page > 1) params.set('page', String(page))
    if (appliedFilters.searchQuery) params.set('search', appliedFilters.searchQuery)
    if (appliedFilters.brands.length > 0) params.set('brand', appliedFilters.brands.join(','))
    if (appliedFilters.minPrice) params.set('minPrice', appliedFilters.minPrice)
    if (appliedFilters.maxPrice) params.set('maxPrice', appliedFilters.maxPrice)
    if (appliedFilters.sortBy) params.set('sortBy', appliedFilters.sortBy)

    const query = params.toString()
    const newUrl = query ? `/shop?${query}` : '/shop'
    router.replace(newUrl, { scroll: false })
  }, [router])

  // Handle filter apply
  const handleApplyFilters = () => {
    setFilters(tempFilters)
    fetchProducts(1, tempFilters)
    syncFiltersToUrl(tempFilters, 1)
>>>>>>> Stashed changes
  }

  // Clear filters
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
<<<<<<< Updated upstream
=======
    fetchProducts(1, emptyFilters)
    syncFiltersToUrl(emptyFilters, 1)
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
>>>>>>> Stashed changes
  }

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      {/* Sidebar Filters - Full Featured */}
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
        {/* Results count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
            Hiển thị <strong>{filteredProducts.length}</strong> / {products.length} sản phẩm
          </p>
        </div>

        {filteredProducts.length === 0 ? (
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
