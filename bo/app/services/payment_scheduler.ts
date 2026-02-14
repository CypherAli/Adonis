import { PaymentService } from '#services/payment_service'

/**
 * Payment Scheduler - Cron Job tự động hủy đơn chưa thanh toán
 *
 * Chạy mỗi phút để kiểm tra và hủy các đơn hàng:
 * - Phương thức: bank_transfer
 * - Trạng thái thanh toán: pending
 * - Đã quá thời gian timeout (mặc định 30 phút)
 */

let isRunning = false
let intervalId: NodeJS.Timeout | null = null

/**
 * Chạy kiểm tra và hủy đơn hết hạn
 */
async function runPaymentCheck() {
  // Tránh chạy trùng lặp
  if (isRunning) {
    console.log('[PaymentScheduler] Previous check still running, skipping...')
    return
  }

  isRunning = true

  try {
    console.log('[PaymentScheduler] Checking for expired orders...')
    const result = await PaymentService.cancelExpiredOrders()

    if (result.success && result.cancelledCount && result.cancelledCount > 0) {
      console.log(
        `[PaymentScheduler] Cancelled ${result.cancelledCount} expired orders:`,
        result.cancelledOrders
      )
    } else if (result.success) {
      // Không log khi không có đơn nào để tránh spam log
    } else {
      console.error('[PaymentScheduler] Error:', result.error)
    }
  } catch (error) {
    console.error('[PaymentScheduler] Unexpected error:', error)
  } finally {
    isRunning = false
  }
}

/**
 * Khởi động scheduler
 * @param intervalMinutes - Khoảng thời gian giữa các lần check (phút)
 */
export function startPaymentScheduler(intervalMinutes: number = 1) {
  if (intervalId) {
    console.log('[PaymentScheduler] Already running')
    return
  }

  const intervalMs = intervalMinutes * 60 * 1000

  console.log(`[PaymentScheduler] Starting... Check every ${intervalMinutes} minute(s)`)
  console.log(
    `[PaymentScheduler] Payment timeout: ${PaymentService.PAYMENT_TIMEOUT_MINUTES} minutes`
  )

  // Chạy ngay lần đầu
  runPaymentCheck()

  // Chạy định kỳ
  intervalId = setInterval(runPaymentCheck, intervalMs)
}

/**
 * Dừng scheduler
 */
export function stopPaymentScheduler() {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
    console.log('[PaymentScheduler] Stopped')
  }
}

/**
 * Kiểm tra trạng thái scheduler
 */
export function isPaymentSchedulerRunning(): boolean {
  return intervalId !== null
}
