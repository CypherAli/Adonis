'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'
import { mapProducts } from '@/lib/utils/product_mapper'
import type { FrontendProduct } from '@/types/product.types'

export default function BestSellers() {
  const [products, setProducts] = useState<FrontendProduct[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
        const res = await fetch(`${API_URL}/api/products?sortBy=popular&limit=4`)
        
        if (!res.ok) {
          throw new Error(`API error: ${res.status}`)
        }
        
        const data = await res.json()
        const mappedProducts = mapProducts(data.products || [])
        setProducts(mappedProducts)
      } catch (error) {
        console.error('Error fetching best sellers:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchBestSellers()
  }, [])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8">Sản Phẩm Bán Chạy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold mb-8"
        >
          Sản Phẩm Bán Chạy
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={product} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
