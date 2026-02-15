import type { Metadata } from 'next'
import Link from 'next/link'
import { mapProducts } from '@/lib/utils/product_mapper'
import ProductCard from '@/components/product/ProductCard'

export const metadata: Metadata = {
  title: 'Best Sellers - Sản Phẩm Bán Chạy | Shoe Store',
  description: 'Các sản phẩm giày thể thao bán chạy nhất tại Shoe Store',
}

async function getBestSellers() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
    const res = await fetch(
      `${API_URL}/api/products?limit=24&sortBy=soldCount&sortOrder=desc`,
      { next: { revalidate: 300 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return mapProducts(data.products || [])
  } catch {
    return []
  }
}

export default async function BestSellersPage() {
  const products = await getBestSellers()

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Best Sellers
          </h1>
          <p className="text-gray-600 text-lg">
            Những sản phẩm được yêu thích và bán chạy nhất tại Shoe Store
          </p>
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg mb-4">Chưa có dữ liệu sản phẩm bán chạy</p>
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Khám phá sản phẩm
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div key={product.id} className="relative">
                {index < 3 && (
                  <div className="absolute -top-2 -left-2 z-10 w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-lg">
                    #{index + 1}
                  </div>
                )}
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        )}

        <div className="mt-8 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Xem tất cả sản phẩm →
          </Link>
        </div>
      </div>
    </main>
  )
}
