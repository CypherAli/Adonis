import apiClient from './api_client'

export interface Order {
  id: string
  userId: string
  items: any[]
  total: number
  status: string
  shippingAddress: any
  paymentMethod: string
  createdAt: string
  updatedAt: string
}

export interface CreateOrderData {
  items: any[]
  shippingAddress: any
  paymentMethod: string
}

// Get user orders
export async function getOrders() {
  const response = await apiClient.get('/orders')
  return response.data
}

// Get single order
export async function getOrder(id: string) {
  const response = await apiClient.get(`/orders/${id}`)
  return response.data
}

// Create new order
export async function createOrder(data: CreateOrderData) {
  const response = await apiClient.post('/orders', data)
  return response.data
}

// Cancel order
export async function cancelOrder(id: string) {
  const response = await apiClient.put(`/orders/${id}/cancel`)
  return response.data
}
