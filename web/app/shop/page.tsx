import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroBanner from '@/components/common/HeroBanner'
import BestSellers from '@/components/product/BestSellers'
import ProductGrid from '@/components/product/ProductGrid'
import { fetchProducts } from '@/lib/api/products.server'

export const metadata: Metadata = {
  title: 'Shop - Giày Thể Thao Chính Hãng | Shoe Store',
  description:
    'Mua giày thể thao, sneakers chính hãng từ Nike, Adidas, Puma với giá tốt nhất. Giao hàng toàn quốc, đổi trả miễn phí.',
  keywords: 'giày thể thao, sneakers, giày nam, giày nữ, Nike, Adidas',
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string
    brand?: string
    category?: string
    page?: string
    minPrice?: string
    maxPrice?: string
    sortBy?: string
    sortOrder?: string
  }>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { products, total, totalPages } = await fetchProducts(page, 20, {
    search: resolvedSearchParams.search,
    brand: resolvedSearchParams.brand,
    category: resolvedSearchParams.category,
    minPrice: resolvedSearchParams.minPrice,
    maxPrice: resolvedSearchParams.maxPrice,
    sortBy: resolvedSearchParams.sortBy,
    sortOrder: resolvedSearchParams.sortOrder,
  })

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      <HeroBanner />
      <BestSellers />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tất Cả Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">{total} sản phẩm có sẵn</p>
        </div>

        <Suspense fallback={
          <div className="flex justify-center py-12">
            <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
          </div>
        }>
          <ProductGrid
            initialProducts={products}
            initialTotal={total}
            initialPage={page}
            initialTotalPages={totalPages}
          />
        </Suspense>
      </section>
    </main>
  )
}
