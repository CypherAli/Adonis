import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import AddToCartButton from '@/components/product/AddToCartButton'
import ProductGallery from '@/components/product/ProductGallery'
import ProductReviews from '@/components/product/ProductReviews'
import RelatedProducts from '@/components/product/RelatedProducts'

/**
 * Product Detail Page - Server Component
 * SEO-optimized với dynamic metadata
 */

interface ProductVariant {
  variantName: string
  sku: string
  price: number
  originalPrice?: number
  stock: number
  specifications: {
    size?: string
    color?: string
    material?: string
    shoeType?: string
    gender?: string
  }
  isAvailable: boolean
}

interface Product {
  _id: string
  name: string
  brand: string
  basePrice: number
  description: string
  images: string[]
  category: string
  variants: ProductVariant[]
  rating?: {
    average?: number
    count?: number
  }
}

// Fetch single product
async function getProduct(id: string): Promise<Product | null> {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      next: { revalidate: 300 }, // Revalidate every 5 minutes
    })
    
    if (!res.ok) {
      return null
    }
    
    const data = await res.json()
    return data.product || data
  } catch (error) {
    console.error('Error fetching product:', error)
    return null
  }
}

// Dynamic Metadata cho SEO
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    return {
      title: 'Product Not Found',
    }
  }
  
  // Get price range from variants
  const prices = product.variants?.map(v => v.price) || [product.basePrice]
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const priceDisplay = minPrice === maxPrice 
    ? `${minPrice.toLocaleString()}đ`
    : `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`
  
  return {
    title: `${product.name} - ${product.brand} | Shoe Store`,
    description: product.description || `Mua ${product.name} chính hãng từ ${product.brand}. Giá từ ${priceDisplay}.`,
    keywords: `${product.name}, ${product.brand}, giày ${product.category}, mua giày online`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description: product.description,
      images: product.images?.[0] ? [product.images[0]] : [],
    },
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = await getProduct(id)
  
  if (!product) {
    notFound()
  }
  
  // Calculate price range from variants
  const prices = product.variants?.map(v => v.price) || [product.basePrice]
  const originalPrices = (product.variants?.map(v => v.originalPrice).filter((p): p is number => typeof p === 'number')) || []
  
  const minPrice = Math.min(...prices)
  const maxPrice = Math.max(...prices)
  const minOriginalPrice = originalPrices.length > 0 ? Math.min(...originalPrices) : null
  
  // Calculate stock from all variants
  const totalStock = product.variants?.reduce((sum, v) => sum + (v.stock || 0), 0) || 0
  
  // Calculate discount if applicable
  const discountPercent = minOriginalPrice && minOriginalPrice > minPrice
    ? Math.round(((minOriginalPrice - minPrice) / minOriginalPrice) * 100)
    : 0

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <nav className="text-sm text-gray-600 mb-6">
          <a href="/" className="hover:text-blue-600">Home</a>
          <span className="mx-2">/</span>
          <a href="/shop" className="hover:text-blue-600">Shop</a>
          <span className="mx-2">/</span>
          <span className="text-gray-900">{product.name}</span>
        </nav>

        {/* Product Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Product Gallery */}
          <ProductGallery
            images={product.images || []}
            productName={product.name}
          />

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Brand & Name */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wide">{product.brand}</p>
              <h1 className="text-4xl font-bold text-gray-900 mt-2">{product.name}</h1>
            </div>

            {/* Rating & Reviews */}
            {product.rating?.average && (
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 font-semibold">{product.rating.average}</span>
                </div>
                <span className="text-gray-500">
                  ({product.rating.count || 0} đánh giá)
                </span>
              </div>
            )}

            {/* Price */}
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold text-red-600">
                {minPrice === maxPrice 
                  ? `${minPrice.toLocaleString()}đ`
                  : `${minPrice.toLocaleString()}đ - ${maxPrice.toLocaleString()}đ`
                }
              </span>
              {minOriginalPrice && minOriginalPrice > minPrice && (
                <>
                  <span className="text-2xl text-gray-400 line-through">
                    {minOriginalPrice.toLocaleString()}đ
                  </span>
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    -{discountPercent}%
                  </span>
                </>
              )}
            </div>

            {/* Stock Status */}
            <div>
              {totalStock > 0 ? (
                <span className="text-green-600 font-medium">
                  ✓ Còn hàng ({totalStock} sản phẩm)
                </span>
              ) : (
                <span className="text-red-600 font-medium">
                  ✗ Hết hàng
                </span>
              )}
            </div>

            {/* Description */}
            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-lg font-semibold mb-3">Mô tả sản phẩm</h2>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Add to Cart - Client Component */}
            <AddToCartButton product={product} />
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-16 border-t border-gray-200 pt-12">
          <ProductReviews productId={product._id} />
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <RelatedProducts productId={product._id} />
        </div>
      </div>
    </main>
  )
}
