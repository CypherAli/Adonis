/**
 * Payment utilities for cart and checkout
 */

export interface PaymentMethod {
  id: string
  name: string
  description: string
  icon?: string
  enabled: boolean
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng (COD)',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    enabled: true,
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Thanh toán trước khi nhận hàng',
    enabled: true,
  },
  {
    id: 'momo',
    name: 'Ví MoMo',
    description: 'Thanh toán qua ví điện tử MoMo',
    enabled: false, // TODO: Enable when integrated
  },
  {
    id: 'vnpay',
    name: 'VNPay',
    description: 'Thanh toán qua cổng VNPay',
    enabled: false, // TODO: Enable when integrated
  },
]

export const SHIPPING_CONFIG = {
  FREE_SHIPPING_THRESHOLD: 15000000, // 15M VND
  DEFAULT_FEE: 30000, // 30K VND
  EXPRESS_FEE: 50000, // 50K VND for express delivery
}

/**
 * Calculate shipping fee based on order total
 */
export function calculateShippingFee(orderTotal: number, isExpress: boolean = false): number {
  if (orderTotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  return isExpress ? SHIPPING_CONFIG.EXPRESS_FEE : SHIPPING_CONFIG.DEFAULT_FEE
}

/**
 * Calculate amount needed for free shipping
 */
export function getFreeShippingRemaining(orderTotal: number): number {
  if (orderTotal >= SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD) {
    return 0
  }
  return SHIPPING_CONFIG.FREE_SHIPPING_THRESHOLD - orderTotal
}

/**
 * Format price to VND
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('vi-VN') + ' đ'
}

/**
 * Validate phone number (Vietnamese format)
 */
export function isValidPhoneNumber(phone: string): boolean {
  const phoneRegex = /^(0|\+84)(3|5|7|8|9)[0-9]{8}$/
  return phoneRegex.test(phone)
}

/**
 * Validate order data before submission
 */
export interface OrderValidation {
  valid: boolean
  errors: string[]
}

export function validateOrderData(data: {
  items: any[]
  shippingInfo: {
    fullName: string
    phone: string
    address: string
    city: string
  }
  paymentMethod: string
}): OrderValidation {
  const errors: string[] = []

  // Check items
  if (!data.items || data.items.length === 0) {
    errors.push('Giỏ hàng trống')
  }

  // Check shipping info
  if (!data.shippingInfo.fullName || data.shippingInfo.fullName.trim().length < 2) {
    errors.push('Họ tên không hợp lệ')
  }

  if (!isValidPhoneNumber(data.shippingInfo.phone)) {
    errors.push('Số điện thoại không hợp lệ')
  }

  if (!data.shippingInfo.address || data.shippingInfo.address.trim().length < 10) {
    errors.push('Địa chỉ giao hàng không hợp lệ')
  }

  if (!data.shippingInfo.city) {
    errors.push('Vui lòng chọn tỉnh/thành phố')
  }

  // Check payment method
  const validPaymentMethods = PAYMENT_METHODS.filter((m) => m.enabled).map((m) => m.id)
  if (!validPaymentMethods.includes(data.paymentMethod)) {
    errors.push('Phương thức thanh toán không hợp lệ')
  }

  return {
    valid: errors.length === 0,
    errors,
  }
}

/**
 * Process order submission
 */
export async function submitOrder(
  orderData: any,
  api: any
): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // Validate order data
    const validation = validateOrderData(orderData)
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
      }
    }

    // Submit to API
    const response = await api.post('/api/orders', orderData)

    return {
      success: true,
      orderId: response.data.orderId || response.data._id,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.response?.data?.message || 'Đặt hàng thất bại. Vui lòng thử lại.',
    }
  }
}
