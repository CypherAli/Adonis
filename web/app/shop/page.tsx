import type { Metadata } from 'next'
import { Suspense } from 'react'
import HeroBanner from '@/components/common/HeroBanner'
import BestSellers from '@/components/product/BestSellers'
import ProductGrid from '@/components/product/ProductGrid'
import { mapProducts } from '@/lib/utils/product_mapper'

export const metadata: Metadata = {
  title: 'Shop - Giày Thể Thao Chính Hãng | Shoe Store',
  description:
    'Mua giày thể thao, sneakers chính hãng từ Nike, Adidas, Puma với giá tốt nhất. Giao hàng toàn quốc, đổi trả miễn phí.',
  keywords: 'giày thể thao, sneakers, giày nam, giày nữ, Nike, Adidas',
}

async function getProducts(page = 1, search?: string, brand?: string, category?: string) {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
    const params = new URLSearchParams()
    params.set('page', String(page))
    params.set('limit', '20')
    if (search) params.set('search', search)
    if (brand) params.set('brand', brand)
    if (category) params.set('category', category)

    const res = await fetch(`${API_URL}/api/products?${params.toString()}`, {
      next: { revalidate: 60 },
    })

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`)
      return { products: [], total: 0, page: 1, totalPages: 1 }
    }

    const data = await res.json()
    const mappedProducts = mapProducts(data.products || [])
    return {
      products: mappedProducts,
      total: data.pagination?.total || data.totalProducts || 0,
      page: data.pagination?.page || 1,
      totalPages: data.pagination?.totalPages || 1,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0, page: 1, totalPages: 1 }
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; brand?: string; category?: string; page?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const page = Number(resolvedSearchParams.page) || 1
  const { products, total, totalPages } = await getProducts(
    page,
    resolvedSearchParams.search,
    resolvedSearchParams.brand,
    resolvedSearchParams.category,
  )

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
