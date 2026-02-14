import apiClient from './api_client'

export interface CartItem {
  productId: string
  quantity: number
  size?: string
  color?: string
}

export interface Cart {
  items: CartItem[]
  total: number
}

// Get user cart
export async function getCart() {
  const response = await apiClient.get('/cart')
  return response.data
}

// Add item to cart
export async function addToCart(item: CartItem) {
  const response = await apiClient.post('/cart/add', item)
  return response.data
}

// Update cart item
export async function updateCartItem(productId: string, quantity: number) {
  const response = await apiClient.put('/cart/update', { productId, quantity })
  return response.data
}

// Remove item from cart
export async function removeFromCart(productId: string) {
  const response = await apiClient.delete(`/cart/remove/${productId}`)
  return response.data
}

// Clear cart
export async function clearCart() {
  const response = await apiClient.delete('/cart/clear')
  return response.data
}
