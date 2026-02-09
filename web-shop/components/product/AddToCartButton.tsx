'use client'

import { useState, useTransition, startTransition } from 'react'
import { useCart } from '@/components/providers/CartProvider'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
  basePrice: number
  images: string[]
  variants: ProductVariant[]
  brand?: string
}

interface AddToCartButtonProps {
  product: Product
}

/**
 * Add to Cart Button - Client Component
 * Sử dụng Zustand store thay vì Context API
 */
export default function AddToCartButton({ product }: AddToCartButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const { addToCart } = useCart()
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  )
  const [quantity, setQuantity] = useState(1)
  const [adding, setAdding] = useState(false)

  // Calculate total stock
  const totalStock = product.variants?.reduce((sum, v) => sum + v.stock, 0) || 0
  const currentStock = selectedVariant?.stock || 0

  const handleAddToCart = async () => {
    // Nếu chưa login, redirect to login
    if (!session) {
      startTransition(() => {
        router.push('/auth/login?callbackUrl=/product/' + product._id)
      })
      return
    }

    if (!selectedVariant) {
      alert('Vui lòng chọn phân loại sản phẩm')
      return
    }

    setAdding(true)

    try {
      // Create product object with selected variant info
      const productToAdd = {
        _id: product._id,
        id: product._id,
        name: product.name,
        price: selectedVariant.price,
        imageUrl: product.images?.[0] || '',
        images: product.images,
        stock: selectedVariant.stock,
        brand: product.brand || '',
        selectedVariant,
        sku: selectedVariant.sku,
      }

      // Add to cart via CartProvider
      await addToCart(productToAdd, quantity)
      
      alert('Đã thêm vào giỏ hàng!')
    } catch (error) {
      console.error('Error adding to cart:', error)
      alert('Có lỗi xảy ra khi thêm vào giỏ hàng')
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Variant Selector */}
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-2">
          <label className="text-gray-700 font-medium">Chọn phân loại:</label>
          <select
            value={selectedVariant?.sku || ''}
            onChange={(e) => {
              const variant = product.variants.find(v => v.sku === e.target.value)
              setSelectedVariant(variant || null)
            }}
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          >
            {product.variants.map((variant) => (
              <option key={variant.sku} value={variant.sku}>
                {variant.variantName} - {variant.price.toLocaleString()}đ
                {variant.stock > 0 ? ` (Còn ${variant.stock})` : ' (Hết hàng)'}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Quantity Selector */}
      <div className="flex items-center gap-4">
        <label className="text-gray-700 font-medium">Số lượng:</label>
        <div className="flex items-center border border-gray-300 rounded-lg">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="px-4 py-2 hover:bg-gray-100"
            disabled={adding}
          >
            -
          </button>
          <span className="px-6 py-2 font-semibold">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(currentStock, quantity + 1))}
            className="px-4 py-2 hover:bg-gray-100"
            disabled={adding}
          >
            +
          </button>
        </div>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={handleAddToCart}
        disabled={adding || currentStock === 0 || !selectedVariant}
        className="w-full bg-blue-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {adding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Đang thêm...
          </span>
        ) : currentStock === 0 ? (
          'Hết hàng'
        ) : (
          'Thêm Vào Giỏ Hàng'
        )}
      </button>

      {/* Buy Now Button */}
      <button
        onClick={() => {
          handleAddToCart()
          startTransition(() => {
            router.push('/cart')
          })
        }}
        disabled={adding || currentStock === 0 || !selectedVariant}
        className="w-full bg-green-600 text-white py-4 px-8 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        Mua Ngay
      </button>
    </div>
  )
}
