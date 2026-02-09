/**
 * Constants for product filters and options
 * Extracted from React SPA web-shop/src/utils/constants.js
 */

export const BRANDS = [
  'All',
  'Nike',
  'Adidas',
  'Puma',
  'Converse',
  'Vans',
  'New Balance',
  'Reebok',
  'Skechers',
  'Under Armour',
]

export const SIZE_OPTIONS = [
  'All',
  '35',
  '36',
  '37',
  '38',
  '39',
  '40',
  '41',
  '42',
  '43',
  '44',
  '45',
]

export const COLOR_OPTIONS = [
  'All',
  'Black',
  'White',
  'Red',
  'Blue',
  'Green',
  'Yellow',
  'Pink',
  'Grey',
  'Brown',
  'Navy',
  'Orange',
]

export const MATERIAL_OPTIONS = ['All', 'Leather', 'Canvas', 'Mesh', 'Suede', 'Synthetic']

export const ITEMS_PER_PAGE = 12

export const API_ENDPOINTS = {
  PRODUCTS: '/api/products',
  PRODUCT_DETAIL: '/api/products',
  CATEGORIES: '/api/categories',
  BRANDS: '/api/brands',
  REVIEWS: '/api/reviews',
  CART: '/api/cart',
  WISHLIST: '/api/wishlist',
  ORDERS: '/api/orders',
  AUTH: '/api/auth',
}

export const STORAGE_KEYS = {
  TOKEN: 'token',
  USER: 'user',
  CART: 'cart',
  WISHLIST: 'wishlist',
  THEME: 'theme',
}

export const DEFAULT_FILTERS = {
  search: '',
  brands: [] as string[],
  sizes: [] as string[],
  colors: [] as string[],
  materials: [] as string[],
  minPrice: '',
  maxPrice: '',
  inStock: false,
  sortBy: '',
}

export const SORT_OPTIONS = [
  { value: '', label: 'Default' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'name_asc', label: 'Name: A-Z' },
  { value: 'name_desc', label: 'Name: Z-A' },
]
