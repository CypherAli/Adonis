/**
 * Products Server API
 * Dùng cho Server Components (RSC) — native fetch với Next.js ISR cache
 * KHÔNG dùng trong Client Components, dùng lib/api/products.ts thay thế
 */

import type { BackendProduct } from '@/types/product.types'
import { mapProducts } from '@/lib/utils/product_mapper'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export interface ProductsResult {
  products: ReturnType<typeof mapProducts>
  total: number
  page: number
  totalPages: number
}

export interface ProductFiltersServer {
  search?: string
  brand?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sortBy?: string
  sortOrder?: string
}

export async function fetchProducts(
  page = 1,
  limit = 20,
  filters?: ProductFiltersServer,
  revalidate = 60,
): Promise<ProductsResult> {
  const params = new URLSearchParams()
  params.set('page', String(page))
  params.set('limit', String(limit))
  if (filters?.search) params.set('search', filters.search)
  if (filters?.brand) params.set('brand', filters.brand)
  if (filters?.category) params.set('category', filters.category)
  if (filters?.minPrice) params.set('minPrice', filters.minPrice)
  if (filters?.maxPrice) params.set('maxPrice', filters.maxPrice)
  if (filters?.sortBy) params.set('sortBy', filters.sortBy)
  if (filters?.sortOrder) params.set('sortOrder', filters.sortOrder)

  try {
    const res = await fetch(`${API_BASE}/api/products?${params.toString()}`, {
      next: { revalidate },
    })
    if (!res.ok) return { products: [], total: 0, page: 1, totalPages: 1 }
    const data = await res.json()
    return {
      products: mapProducts(data.products || []),
      total: data.pagination?.total ?? data.totalProducts ?? 0,
      page: data.pagination?.page ?? 1,
      totalPages: data.pagination?.totalPages ?? 1,
    }
  } catch {
    return { products: [], total: 0, page: 1, totalPages: 1 }
  }
}

export async function fetchBestSellers(limit = 24): Promise<ReturnType<typeof mapProducts>> {
  try {
    const res = await fetch(
      `${API_BASE}/api/products?limit=${limit}&sortBy=soldCount&sortOrder=desc`,
      { next: { revalidate: 300 } },
    )
    if (!res.ok) return []
    const data = await res.json()
    return mapProducts(data.products || [])
  } catch {
    return []
  }
}

export async function fetchProductById(id: string): Promise<BackendProduct | null> {
  try {
    const res = await fetch(`${API_BASE}/api/products/${id}`, {
      next: { revalidate: 300 },
    })
    if (!res.ok) return null
    const data = await res.json()
    return data.product ?? data
  } catch {
    return null
  }
}
