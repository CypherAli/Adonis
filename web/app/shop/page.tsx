import type { Metadata } from 'next'
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

async function getProducts() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
    const res = await fetch(`${API_URL}/api/products?limit=20`, {
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    })

    if (!res.ok) {
      console.error(`API error: ${res.status} ${res.statusText}`)
      return { products: [], total: 0 }
    }

    const data = await res.json()
    const mappedProducts = mapProducts(data.products || [])
    return {
      products: mappedProducts,
      total: data.totalProducts || 0,
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return { products: [], total: 0 }
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; brand?: string; category?: string }>
}) {
  const resolvedSearchParams = await searchParams
  const { products, total } = await getProducts()

  return (
    <main className="min-h-screen" style={{ background: 'var(--bg-body)' }}>
      <HeroBanner />
      <BestSellers />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tất Cả Sản Phẩm</h1>
          <p className="text-gray-600 mt-2">{total} sản phẩm có sẵn</p>
        </div>

        <ProductGrid initialProducts={products} />
      </section>
    </main>
  )
}
