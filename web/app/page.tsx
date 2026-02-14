"use client"

import React, { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useCart } from '@/components/providers/CartProvider'
import { useWishlist } from '@/components/providers/WishlistProvider'
import Loading from '@/components/loading/Loading'
import HeroBanner from '@/components/common/HeroBanner'
import BestSellers from '@/components/product/BestSellers'
import Testimonials from '@/components/common/Testimonials'
import CompareBar from '@/components/comparison/CompareBar'
import FilterSidebar from '@/components/sidebar/FilterSidebar'
import AnimatedProductCard from '@/components/product/AnimatedProductCard'
import QuickViewModal from '@/components/modal/QuickViewModal'
import { BRANDS, SIZE_OPTIONS, COLOR_OPTIONS, MATERIAL_OPTIONS } from '@/lib/constants'
import api from '@/lib/api'

export default function HomePage() {
  const searchParams = useSearchParams()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)

  // Temporary filters - chỉ lưu trong UI, chưa apply
  const [tempFilters, setTempFilters] = useState({
    search: '',
    brands: [] as string[],
    sizes: [] as string[],
    colors: [] as string[],
    materials: [] as string[],
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: '',
  })

  // Applied filters for API
  const [appliedFilters, setAppliedFilters] = useState({
    search: '',
    brand: '',
    size: '',
    color: '',
    material: '',
    minPrice: '',
    maxPrice: '',
    inStock: false,
    sortBy: '',
  })

  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalProducts, setTotalProducts] = useState(0)

  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const { data: session } = useSession()
  const user = session?.user

  // Available filter options (bỏ 'All', chỉ lấy các option thực)
  const brands = BRANDS.filter((b) => b !== 'All')
  const sizeOptions = SIZE_OPTIONS.filter((s) => s !== 'All')
  const colorOptions = COLOR_OPTIONS.filter((c) => c !== 'All')
  const materialOptions = MATERIAL_OPTIONS.filter((m) => m !== 'All')

  // Fetch products when applied filters change
  useEffect(() => {
    fetchProducts()
  }, [appliedFilters, currentPage])

  // Handle URL search query parameter
  useEffect(() => {
    const searchQuery = searchParams?.get('search')
    if (searchQuery) {
      setTempFilters((prev) => ({ ...prev, search: searchQuery }))
      setAppliedFilters((prev) => ({ ...prev, search: searchQuery }))

      setTimeout(() => {
        const productsSection = document.getElementById('products-section')
        if (productsSection) {
          productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }, 500)
    }
  }, [searchParams])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      
      if (appliedFilters.search) params.append('search', appliedFilters.search)
      if (appliedFilters.brand) params.append('brand', appliedFilters.brand)
      if (appliedFilters.size) params.append('size', appliedFilters.size)
      if (appliedFilters.color) params.append('color', appliedFilters.color)
      if (appliedFilters.material) params.append('material', appliedFilters.material)
      if (appliedFilters.minPrice) params.append('minPrice', appliedFilters.minPrice)
      if (appliedFilters.maxPrice) params.append('maxPrice', appliedFilters.maxPrice)
      if (appliedFilters.inStock) params.append('inStock', 'true')
      if (appliedFilters.sortBy) params.append('sortBy', appliedFilters.sortBy)
      params.append('page', currentPage.toString())
      params.append('limit', '12')

      const response = await api.get(`/api/products?${params.toString()}`)
      const data = response.data
      
      setProducts(data.data || data.products || data || [])
      setTotalPages(data.pagination?.totalPages || 1)
      setTotalProducts(data.pagination?.total || (data.data || data.products || data || []).length)
    } catch (error) {
      console.error('Error fetching products:', error)
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (tempFilters.search) count++
    count += tempFilters.brands.length
    count += tempFilters.sizes.length
    count += tempFilters.colors.length
    count += tempFilters.materials.length
    if (tempFilters.minPrice || tempFilters.maxPrice) count++
    if (tempFilters.inStock) count++
    if (tempFilters.sortBy) count++
    return count
  }, [tempFilters])

  // Handle temporary filter changes (chưa apply)
  const handleTempFilterChange = (filterName: string, value: any) => {
    setTempFilters((prev) => ({ ...prev, [filterName]: value }))
  }

  // Toggle multiple selection (brands, sizes, colors, materials)
  const toggleArrayFilter = (filterName: string, value: string) => {
    setTempFilters((prev) => {
      const currentArray = prev[filterName as keyof typeof prev] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [filterName]: newArray }
    })
  }

  // Apply all filters when clicking "Tìm kiếm"
  const handleApplyFilters = () => {
    const brandString = tempFilters.brands.join(',')
    const sizeString = tempFilters.sizes.join(',')
    const colorString = tempFilters.colors.join(',')
    const materialString = tempFilters.materials.join(',')

    setAppliedFilters({
      search: tempFilters.search,
      brand: brandString,
      size: sizeString,
      color: colorString,
      material: materialString,
      minPrice: tempFilters.minPrice,
      maxPrice: tempFilters.maxPrice,
      inStock: tempFilters.inStock,
      sortBy: tempFilters.sortBy,
    })
    
    setCurrentPage(1)

    setTimeout(() => {
      const productsGrid = document.querySelector('.product-grid')
      if (productsGrid) {
        productsGrid.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }, 300)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleApplyFilters()
    }
  }

  const handleClearFilters = () => {
    setTempFilters({
      search: '',
      brands: [],
      sizes: [],
      colors: [],
      materials: [],
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: '',
    })
    setAppliedFilters({
      search: '',
      brand: '',
      size: '',
      color: '',
      material: '',
      minPrice: '',
      maxPrice: '',
      inStock: false,
      sortBy: '',
    })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    const productsSection = document.querySelector('.homepage-container')
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading && products.length === 0) {
    return <Loading message="Loading products..." size="large" />
  }

  return (
    <>
      <HeroBanner
        onBrandClick={(brand: string) => {
          toggleArrayFilter('brands', brand)
          setTimeout(() => {
            const container = document.querySelector('.homepage-container')
            if (container) {
              container.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }
          }, 100)
        }}
      />

      <BestSellers />

      <div id="products-section" className="homepage-container">
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

        <main className="main-content">
          <motion.div
            className="page-header"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 100 }}
            >
              Shoes
            </motion.h1>
            <motion.p
              className="product-count"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
            >
              {totalProducts} products
            </motion.p>
          </motion.div>

          {/* Display Selected Filters with Animation */}
          {(tempFilters.brands.length > 0 ||
            tempFilters.sizes.length > 0 ||
            tempFilters.colors.length > 0 ||
            tempFilters.materials.length > 0 ||
            tempFilters.search) && (
            <motion.div
              className="selected-filters"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <strong>Đã chọn:</strong>
              {tempFilters.search && (
                <motion.span
                  className="filter-tag"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                >
                  {tempFilters.search}
                </motion.span>
              )}
              {tempFilters.brands.map((b, i) => (
                <motion.span
                  key={b}
                  className="filter-tag"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                >
                  {b}
                </motion.span>
              ))}
              {tempFilters.sizes.map((s, i) => (
                <motion.span
                  key={s}
                  className="filter-tag"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                >
                  Size {s}
                </motion.span>
              ))}
              {tempFilters.colors.map((c, i) => (
                <motion.span
                  key={c}
                  className="filter-tag"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                >
                  {c}
                </motion.span>
              ))}
              {tempFilters.materials.map((m, i) => (
                <motion.span
                  key={m}
                  className="filter-tag"
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: i * 0.05, type: 'spring' }}
                >
                  {m}
                </motion.span>
              ))}
              <span className="filter-note">(Click "Search" to apply)</span>
            </motion.div>
          )}

          {/* Product Grid with Framer Motion */}
          <motion.div
            className="product-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {products.length === 0 ? (
              <motion.p
                className="no-products"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                No products available.
              </motion.p>
            ) : (
              products.map((product, index) => (
                <AnimatedProductCard
                  key={product._id || product.id}
                  product={product}
                  index={index}
                  onQuickView={setSelectedProduct}
                  userRole={user?.role}
                />
              ))
            )}
          </motion.div>

          {/* Pagination with Animation */}
          {totalPages > 1 && (
            <motion.div
              className="pagination"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                className="page-btn"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                ← Prev
              </motion.button>

              {[...Array(totalPages)].map((_, index) => (
                <motion.button
                  key={index + 1}
                  className={`page-btn ${currentPage === index + 1 ? 'active' : ''}`}
                  onClick={() => handlePageChange(index + 1)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  {index + 1}
                </motion.button>
              ))}

              <motion.button
                className="page-btn"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Next →
              </motion.button>
            </motion.div>
          )}
        </main>
      </div>

      {/* Quick View Modal */}
      {selectedProduct && (
        <QuickViewModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(product, quantity, size, color) => {
            addToCart(product, quantity, size, color)
          }}
          onToggleWishlist={toggleWishlist}
          isInWishlist={isInWishlist(String(selectedProduct._id || selectedProduct.id))}
        />
      )}

      {/* Testimonials Section */}
      <Testimonials />

      {/* Compare Bar (Bottom Sticky) */}
      <CompareBar />
    </>
  )
}