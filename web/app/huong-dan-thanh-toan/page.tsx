import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Hướng Dẫn Thanh Toán | Shoe Store',
  description: 'Các phương thức thanh toán tại Shoe Store - COD, chuyển khoản, thẻ, ví điện tử',
}

export default function Page() {
  return (
    <GenericPage
      title="Hướng Dẫn Thanh Toán"
      icon="💳"
      description="Đa dạng phương thức thanh toán an toàn, bảo mật. Hỗ trợ COD, chuyển khoản, thẻ và ví điện tử."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: '1. Thanh toán khi nhận hàng (COD)',
          content: [
            '✓ Thanh toán bằng tiền mặt khi nhận hàng',
            '✓ Áp dụng cho đơn hàng dưới 5.000.000đ',
            '✓ Phí COD: Miễn phí',
            '✓ Vui lòng kiểm tra hàng trước khi thanh toán',
          ],
        },
        {
          title: '2. Chuyển khoản ngân hàng',
          content: [
            '🏦 Ngân hàng: Vietcombank',
            '📝 Số tài khoản: 0123456789',
            '👤 Chủ tài khoản: CÔNG TY SHOE STORE',
            '📋 Nội dung: Mã đơn hàng + Số điện thoại',
            '⚠️ Đơn hàng sẽ được xử lý sau khi nhận được tiền (thường 15-30 phút)',
          ],
        },
        {
          title: '3. Thanh toán bằng thẻ',
          content: [
            '💳 Thẻ nội địa (ATM): Miễn phí giao dịch',
            '💳 Thẻ quốc tế: VISA, MasterCard, JCB',
            '🔒 Bảo mật theo tiêu chuẩn PCI DSS',
            '✓ Thanh toán nhanh chóng, an toàn',
          ],
        },
        {
          title: '4. Ví điện tử',
          content: [
            '📱 MoMo - Ưu đãi hoàn tiền 10% (tối đa 50.000đ)',
            '📱 ZaloPay - Giảm 15.000đ cho đơn từ 200.000đ',
            '📱 VNPay - Tích điểm đổi quà',
            '📱 ShopeePay - Voucher giảm giá độc quyền',
          ],
        },
        {
          title: 'Lưu ý quan trọng',
          content: [
            '⚠️ Kiểm tra kỹ thông tin thanh toán trước khi xác nhận',
            '⚠️ Không chia sẻ mã OTP, thông tin thẻ với bất kỳ ai',
            '⚠️ Nếu thanh toán thất bại, vui lòng thử lại hoặc chọn phương thức khác',
            '⚠️ Liên hệ hotline 1900 xxxx nếu cần hỗ trợ',
            '⚠️ Hóa đơn VAT có thể yêu cầu thêm khi đặt hàng',
          ],
        },
      ]}
    />
  )
}
