'use client'

import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { motion } from 'framer-motion'
import type { Product } from '@/types/product'

export default function RelatedProducts({ productId }: { productId: string }) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
        const res = await fetch(`${API_URL}/api/products?limit=4&exclude=${productId}`)
        const data = await res.json()
        setProducts(data.products || [])
      } catch (error) {
        console.error('Error fetching related products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRelated()
  }, [productId])

  if (loading) return null

  return (
    <section className="mt-16">
      <h3 className="text-2xl font-bold mb-6">Sản Phẩm Liên Quan</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => {
          const productId = product.id || product._id || `product-${index}`;
          const productImage = product.image || product.imageUrl || product.images?.[0] || '/images/placeholder-product.svg';
          
          return (
            <motion.div
              key={productId}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ProductCard product={{
                id: productId,
                name: product.name,
                price: product.price || product.basePrice || 0,
                originalPrice: product.originalPrice,
                image: productImage,
                brand: product.brand || '',
                rating: product.rating || 0,
                reviewCount: product.reviewCount || 0
              }} />
            </motion.div>
          );
        })}
      </div>
    </section>
  )
}
