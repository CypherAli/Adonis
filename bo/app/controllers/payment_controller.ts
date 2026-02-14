import type { HttpContext } from '@adonisjs/core/http'
import { PaymentService } from '#services/payment_service'
import crypto from 'node:crypto'
import env from '#start/env'

/**
 * Payment Controller - Xử lý thanh toán ngân hàng
 *
 * Endpoints:
 * 1. POST /webhook/payment - Nhận webhook từ ngân hàng
 * 2. GET /orders/:id/payment-info - Lấy thông tin thanh toán (QR, STK)
 * 3. GET /orders/:id/payment-status - Kiểm tra trạng thái thanh toán
 * 4. POST /admin/orders/:id/confirm-payment - Admin xác nhận thủ công
 */
export default class PaymentController {
  /**
   * Webhook endpoint - Nhận thông báo từ ngân hàng/payment gateway
   * Các dịch vụ: Casso, PayOS, SePay, hoặc ngân hàng trực tiếp
   */
  async webhook({ request, response }: HttpContext) {
    try {
      // Lấy dữ liệu webhook
      const body = request.body()
      const signature = request.header('x-signature') || request.header('authorization')

      // Verify signature (tùy theo provider)
      const webhookSecret = env.get('PAYMENT_WEBHOOK_SECRET')
      if (webhookSecret && signature) {
        const isValid = this.verifyWebhookSignature(body, signature, webhookSecret)
        if (!isValid) {
          console.error('Invalid webhook signature')
          return response.status(401).json({ error: 'Invalid signature' })
        }
      }

      // Log webhook để debug
      console.log('Received payment webhook:', JSON.stringify(body, null, 2))

      // Parse dữ liệu webhook (format tùy provider)
      // Đây là format chung, bạn cần điều chỉnh theo provider thực tế
      const webhookData = this.parseWebhookData(body)

      if (!webhookData) {
        return response.status(400).json({ error: 'Invalid webhook data' })
      }

      // Xử lý thanh toán
      const result = await PaymentService.processWebhookPayment(webhookData)

      if (result.success) {
        console.log(`Payment confirmed for order: ${result.order?.orderNumber}`)
        return response.json({
          success: true,
          message: 'Payment processed successfully',
          orderNumber: result.order?.orderNumber,
        })
      } else {
        console.warn('Payment processing failed:', result.error)
        // Vẫn trả về 200 để webhook không retry
        return response.json({
          success: false,
          error: result.error,
        })
      }
    } catch (error) {
      console.error('Webhook error:', error)
      return response.status(500).json({
        error: 'Internal server error',
        message: error.message,
      })
    }
  }

  /**
   * Lấy thông tin thanh toán cho đơn hàng
   * Trả về QR code, số tài khoản, nội dung chuyển khoản
   */
  async getPaymentInfo({ params, response }: HttpContext) {
    try {
      const orderId = params.id

      const result = await PaymentService.getPaymentInfo(orderId)

      if (!result.success) {
        return response.status(400).json({
          message: result.error,
        })
      }

      return response.json(result)
    } catch (error) {
      console.error('Get payment info error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Kiểm tra trạng thái thanh toán
   * Client polling endpoint
   */
  async checkPaymentStatus({ params, response }: HttpContext) {
    try {
      const orderId = params.id
      const result = await PaymentService.checkPaymentStatus(orderId)

      if (!result.success) {
        return response.status(404).json({
          message: result.error,
        })
      }

      return response.json(result)
    } catch (error) {
      console.error('Check payment status error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Admin xác nhận thanh toán thủ công
   */
  async confirmPaymentManually({ params, request, response }: HttpContext) {
    try {
      const user = (request as any).user
      const orderId = params.id
      const { transactionId, note } = request.only(['transactionId', 'note'])

      // Kiểm tra quyền admin
      if (user.role !== 'admin') {
        return response.status(403).json({
          message: 'Bạn không có quyền thực hiện thao tác này',
        })
      }

      const result = await PaymentService.confirmPaymentManually(orderId, user.id, {
        transactionId,
        note,
      })

      if (!result.success) {
        return response.status(400).json({
          message: result.error,
        })
      }

      return response.json({
        message: 'Xác nhận thanh toán thành công',
        order: result.order,
      })
    } catch (error) {
      console.error('Confirm payment error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Trigger manual check for expired orders (Admin only)
   * Hữu ích khi cron job không hoạt động
   */
  async cancelExpiredOrders({ request, response }: HttpContext) {
    try {
      const user = (request as any).user

      if (user.role !== 'admin') {
        return response.status(403).json({
          message: 'Bạn không có quyền thực hiện thao tác này',
        })
      }

      const result = await PaymentService.cancelExpiredOrders()

      return response.json({
        message: `Đã hủy ${result.cancelledCount} đơn hàng hết hạn`,
        ...result,
      })
    } catch (error) {
      console.error('Cancel expired orders error:', error)
      return response.status(500).json({
        message: 'Lỗi server',
        error: error.message,
      })
    }
  }

  /**
   * Verify webhook signature
   * Điều chỉnh theo provider của bạn
   */
  private verifyWebhookSignature(body: any, signature: string, secret: string): boolean {
    try {
      // Format phổ biến: HMAC-SHA256
      const computedSignature = crypto
        .createHmac('sha256', secret)
        .update(JSON.stringify(body))
        .digest('hex')

      return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(computedSignature))
    } catch {
      return false
    }
  }

  /**
   * Parse webhook data từ các provider khác nhau
   * Điều chỉnh theo provider của bạn (Casso, PayOS, SePay, etc.)
   */
  private parseWebhookData(body: any): {
    amount: number
    content: string
    transactionId: string
    bankCode?: string
    transferTime?: Date
  } | null {
    try {
      // Format Casso
      if (body.data && Array.isArray(body.data)) {
        const transaction = body.data[0]
        return {
          amount: Math.abs(transaction.amount),
          content: transaction.description || '',
          transactionId: transaction.id?.toString() || transaction.tid,
          bankCode: transaction.bankSubAccId,
          transferTime: transaction.when ? new Date(transaction.when) : undefined,
        }
      }

      // Format PayOS
      if (body.code === '00' && body.data) {
        return {
          amount: body.data.amount,
          content: body.data.description || body.data.orderCode,
          transactionId: body.data.reference || body.data.id,
          transferTime: body.data.transactionDateTime
            ? new Date(body.data.transactionDateTime)
            : undefined,
        }
      }

      // Format SePay
      if (body.transferType && body.content) {
        return {
          amount: body.transferAmount,
          content: body.content,
          transactionId: body.id?.toString() || body.referenceCode,
          bankCode: body.subAccId,
          transferTime: body.transactionDate ? new Date(body.transactionDate) : undefined,
        }
      }

      // Generic format
      if (body.amount && body.content) {
        return {
          amount: body.amount,
          content: body.content || body.description || body.memo,
          transactionId: body.transactionId || body.id || body.reference,
          bankCode: body.bankCode,
          transferTime: body.transferTime ? new Date(body.transferTime) : undefined,
        }
      }

      return null
    } catch (error) {
      console.error('Parse webhook data error:', error)
      return null
    }
  }
}
