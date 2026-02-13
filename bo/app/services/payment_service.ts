import { Order } from '#models/order'
import { Product } from '#models/product'
import mongoose from 'mongoose'
import env from '#start/env'

/**
 * Payment Service - Xử lý thanh toán ngân hàng
 *
 * Tính năng:
 * 1. Xác nhận thanh toán từ webhook ngân hàng
 * 2. Xác nhận thanh toán thủ công (Admin)
 * 3. Tự động hủy đơn chưa thanh toán sau thời gian timeout
 * 4. Hoàn trả tồn kho khi hủy đơn
 */
export class PaymentService {
  // Thời gian timeout thanh toán (phút) - lấy từ env hoặc mặc định 30
  static PAYMENT_TIMEOUT_MINUTES = env.get('PAYMENT_TIMEOUT_MINUTES') || 30

  // Thông tin ngân hàng từ env
  static BANK_CODE = env.get('BANK_CODE') || 'SHB'
  static BANK_ACCOUNT_NUMBER = env.get('BANK_ACCOUNT_NUMBER') || '0848565650'
  static BANK_ACCOUNT_NAME = env.get('BANK_ACCOUNT_NAME') || 'CONG TY TNHH SHOE SHOP'

  /**
   * Xác nhận thanh toán từ webhook ngân hàng
   * Parse nội dung chuyển khoản để tìm mã đơn hàng
   */
  static async processWebhookPayment(webhookData: {
    amount: number
    content: string
    transactionId: string
    bankCode?: string
    transferTime?: Date
  }) {
    const { amount, content, transactionId, bankCode, transferTime } = webhookData

    // Parse mã đơn hàng từ nội dung chuyển khoản
    // Format expected: "DH27324247" hoặc "ORD-20260209-1234"
    const orderNumberMatch =
      content.match(/(?:DH|ORD[-]?\d{8}[-]?)(\d{4,})/i) || content.match(/(ORD-\d{8}-\d{4})/i)

    if (!orderNumberMatch) {
      return {
        success: false,
        error: 'Không tìm thấy mã đơn hàng trong nội dung chuyển khoản',
        content,
      }
    }

    const orderNumber = orderNumberMatch[1] || orderNumberMatch[0]

    // Tìm đơn hàng
    const order = await Order.findOne({
      $or: [{ orderNumber: orderNumber }, { orderNumber: { $regex: orderNumber, $options: 'i' } }],
      paymentMethod: 'bank_transfer',
      paymentStatus: 'pending',
    })

    if (!order) {
      return {
        success: false,
        error: 'Không tìm thấy đơn hàng phù hợp',
        orderNumber,
      }
    }

    // Kiểm tra số tiền
    const tolerance = 1000 // Cho phép sai lệch 1000đ
    if (Math.abs(order.totalAmount - amount) > tolerance) {
      return {
        success: false,
        error: `Số tiền không khớp. Cần: ${order.totalAmount}, Nhận: ${amount}`,
        orderNumber: order.orderNumber,
      }
    }

    // Cập nhật trạng thái thanh toán
    order.paymentStatus = 'paid'
    order.paymentDetails = {
      transactionId,
      paidAt: transferTime || new Date(),
      paymentGateway: bankCode || 'bank_transfer',
    }

    // Thêm vào lịch sử
    order.statusHistory.push({
      status: 'payment_confirmed',
      note: `Thanh toán đã được xác nhận. Mã GD: ${transactionId}`,
      timestamp: new Date(),
    })

    await order.save()

    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
      },
    }
  }

  /**
   * Admin xác nhận thanh toán thủ công
   * Dùng khi webhook không nhận diện được (sai nội dung CK)
   */
  static async confirmPaymentManually(
    orderId: string,
    adminId: string,
    paymentDetails: {
      transactionId?: string
      note?: string
    }
  ) {
    const order = await Order.findById(orderId)

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' }
    }

    if (order.paymentStatus === 'paid') {
      return { success: false, error: 'Đơn hàng đã được thanh toán' }
    }

    if (order.status === 'cancelled') {
      return { success: false, error: 'Đơn hàng đã bị hủy' }
    }

    // Cập nhật trạng thái
    order.paymentStatus = 'paid'
    order.paymentDetails = {
      transactionId: paymentDetails.transactionId || `MANUAL-${Date.now()}`,
      paidAt: new Date(),
      paymentGateway: 'manual_confirm',
    }

    order.statusHistory.push({
      status: 'payment_confirmed',
      note: paymentDetails.note || 'Thanh toán được xác nhận thủ công bởi Admin',
      updatedBy: new mongoose.Types.ObjectId(adminId),
      timestamp: new Date(),
    })

    await order.save()

    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        paymentStatus: order.paymentStatus,
      },
    }
  }

  /**
   * Tự động hủy đơn chưa thanh toán sau thời gian timeout
   * Chạy bởi cron job mỗi phút
   */
  static async cancelExpiredOrders() {
    const session = await mongoose.startSession()
    session.startTransaction()

    try {
      const timeoutDate = new Date()
      timeoutDate.setMinutes(timeoutDate.getMinutes() - this.PAYMENT_TIMEOUT_MINUTES)

      // Tìm các đơn hàng:
      // - Phương thức: bank_transfer
      // - Trạng thái thanh toán: pending
      // - Trạng thái đơn: confirmed (đã tạo nhưng chưa xử lý)
      // - Tạo trước thời gian timeout
      const expiredOrders = await Order.find({
        paymentMethod: 'bank_transfer',
        paymentStatus: 'pending',
        status: { $in: ['pending', 'confirmed'] },
        createdAt: { $lt: timeoutDate },
      }).session(session)

      const cancelledOrders = []

      for (const order of expiredOrders) {
        // Hoàn trả tồn kho
        for (const item of order.items) {
          await Product.findOneAndUpdate(
            { '_id': item.product, 'variants.sku': item.variantSku },
            {
              $inc: {
                'variants.$.stock': item.quantity,
                'soldCount': -item.quantity,
              },
            },
            { session }
          )
        }

        // Cập nhật trạng thái đơn hàng
        order.status = 'cancelled'
        order.paymentStatus = 'failed'
        order.cancelReason = `Tự động hủy do chưa thanh toán sau ${this.PAYMENT_TIMEOUT_MINUTES} phút`
        order.statusHistory.push({
          status: 'cancelled',
          note: `Đơn hàng tự động hủy - Hết thời gian thanh toán (${this.PAYMENT_TIMEOUT_MINUTES} phút)`,
          timestamp: new Date(),
        })

        await order.save({ session })
        cancelledOrders.push(order.orderNumber)
      }

      await session.commitTransaction()

      return {
        success: true,
        cancelledCount: cancelledOrders.length,
        cancelledOrders,
      }
    } catch (error) {
      await session.abortTransaction()
      console.error('Error cancelling expired orders:', error)
      return {
        success: false,
        error: error.message,
      }
    } finally {
      session.endSession()
    }
  }

  /**
   * Lấy thông tin thanh toán cho đơn hàng
   * Trả về thông tin QR, số tài khoản, nội dung CK
   */
  static async getPaymentInfo(orderId: string) {
    const order = await Order.findById(orderId)

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' }
    }

    if (order.paymentMethod !== 'bank_transfer') {
      return { success: false, error: 'Đơn hàng không sử dụng phương thức chuyển khoản' }
    }

    // Thông tin ngân hàng từ env
    const bankInfo = {
      bankName: this.getBankName(this.BANK_CODE),
      bankCode: this.BANK_CODE,
      accountNumber: this.BANK_ACCOUNT_NUMBER,
      accountName: this.BANK_ACCOUNT_NAME,
      amount: order.totalAmount,
      content: `${order.orderNumber.replace('ORD-', 'DH').replace(/-/g, '')} ${order.orderNumber}`,
      // VietQR URL format
      qrUrl: this.generateVietQRUrl({
        bankCode: this.BANK_CODE,
        accountNumber: this.BANK_ACCOUNT_NUMBER,
        amount: order.totalAmount,
        content: order.orderNumber,
      }),
    }

    // Tính thời gian còn lại
    const createdAt = new Date(order.createdAt!)
    const expiresAt = new Date(createdAt.getTime() + this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000)
    const remainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000))

    return {
      success: true,
      order: {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        paymentStatus: order.paymentStatus,
        status: order.status,
      },
      bankInfo,
      expiresAt,
      remainingSeconds,
    }
  }

  /**
   * Generate VietQR URL
   */
  private static generateVietQRUrl(params: {
    bankCode: string
    accountNumber: string
    amount: number
    content: string
  }) {
    const { bankCode, accountNumber, amount, content } = params
    // VietQR API format
    return `https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?amount=${amount}&addInfo=${encodeURIComponent(content)}&accountName=${encodeURIComponent(this.BANK_ACCOUNT_NAME)}`
  }

  /**
   * Lấy tên ngân hàng từ mã
   */
  private static getBankName(bankCode: string): string {
    const bankNames: Record<string, string> = {
      SHB: 'SHB - Ngân hàng TMCP Sài Gòn - Hà Nội',
      VCB: 'Vietcombank - Ngân hàng TMCP Ngoại thương Việt Nam',
      TCB: 'Techcombank - Ngân hàng TMCP Kỹ thương Việt Nam',
      MB: 'MB Bank - Ngân hàng TMCP Quân đội',
      ACB: 'ACB - Ngân hàng TMCP Á Châu',
      VPB: 'VPBank - Ngân hàng TMCP Việt Nam Thịnh Vượng',
      BIDV: 'BIDV - Ngân hàng TMCP Đầu tư và Phát triển Việt Nam',
      VTB: 'VietinBank - Ngân hàng TMCP Công thương Việt Nam',
      TPB: 'TPBank - Ngân hàng TMCP Tiên Phong',
      STB: 'Sacombank - Ngân hàng TMCP Sài Gòn Thương Tín',
    }
    return bankNames[bankCode] || bankCode
  }

  /**
   * Kiểm tra trạng thái thanh toán
   */
  static async checkPaymentStatus(orderId: string) {
    const order = await Order.findById(orderId).select(
      'orderNumber paymentStatus paymentDetails status createdAt'
    )

    if (!order) {
      return { success: false, error: 'Không tìm thấy đơn hàng' }
    }

    const createdAt = new Date(order.createdAt!)
    const expiresAt = new Date(createdAt.getTime() + this.PAYMENT_TIMEOUT_MINUTES * 60 * 1000)
    const isExpired = order.paymentStatus === 'pending' && new Date() > expiresAt

    return {
      success: true,
      orderNumber: order.orderNumber,
      paymentStatus: order.paymentStatus,
      orderStatus: order.status,
      paymentDetails: order.paymentDetails,
      isExpired,
      expiresAt,
    }
  }
}
