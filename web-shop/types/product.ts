export interface Product {
  id: string
  _id?: string
  name: string
  description?: string
  brand?: string
  price?: number
  basePrice?: number
  originalPrice?: number
  salePrice?: number
  imageUrl?: string
  images?: string[]
  image?: string
  stock?: number
  totalStock?: number
  variants?: ProductVariant[]
  createdBy?: {
    shopName: string
  }
  category?: string
  rating?: number
  reviews?: number
  reviewCount?: number
  size?: string
  color?: string
  material?: string
  inStock?: boolean
  isSale?: boolean
  salePercent?: number
  isNew?: boolean
  features?: string[]
}

export interface ProductVariant {
  id?: number
  productId?: number
  variantName?: string
  sku?: string
  price: number
  originalPrice?: number
  stock: number
  size?: string
  color?: string
  gender?: string
  material?: string
  specifications?: {
    size?: string
    color?: string
    gender?: string
    material?: string
  }
}
