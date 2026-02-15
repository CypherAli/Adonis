import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Trả Góp 0% | Shoe Store',
  description: 'Hướng dẫn mua giày trả góp 0% lãi suất tại Shoe Store - Duyệt nhanh, thủ tục đơn giản',
}

export default function Page() {
  return (
    <GenericPage
      title="Trả Góp 0% Lãi Suất"
      icon="💰"
      description="Mua giày trả góp 0% lãi suất, duyệt nhanh chỉ 5 phút. Áp dụng cho đơn hàng từ 1.000.000đ."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Điều kiện trả góp',
          content: [
            '✓ Đơn hàng từ 1.000.000đ trở lên',
            '✓ Công dân Việt Nam từ 18 tuổi trở lên',
            '✓ Có CMND/CCCD còn hiệu lực',
            '✓ Không cần chứng minh thu nhập',
          ],
        },
        {
          title: 'Đối tác tài chính',
          content: [
            '🏦 Home Credit - Trả góp 0% từ 3-12 tháng',
            '🏦 FE Credit - Trả góp 0% từ 6-18 tháng',
            '🏦 Kredivo - Trả góp 0% từ 3-6 tháng',
            '💳 Thẻ tín dụng - Trả góp qua ngân hàng phát hành',
          ],
        },
        {
          title: 'Cách thức trả góp',
          content: [
            '1️⃣ Chọn sản phẩm và thêm vào giỏ hàng',
            '2️⃣ Tại bước thanh toán, chọn "Trả góp 0%"',
            '3️⃣ Chọn đối tác tài chính và kỳ hạn (3, 6, 9, 12 tháng)',
            '4️⃣ Điền thông tin cá nhân và tải lên ảnh CMND/CCCD',
            '5️⃣ Chờ duyệt (5-30 phút) và nhận hàng',
          ],
        },
        {
          title: 'Ví dụ tính trả góp',
          content: [
            '📌 Giày Nike Air Max - Giá: 3.000.000đ',
            '• Trả góp 3 tháng: 1.000.000đ/tháng (0% lãi suất)',
            '• Trả góp 6 tháng: 500.000đ/tháng (0% lãi suất)',
            '• Trả góp 12 tháng: 250.000đ/tháng (0% lãi suất)',
            '',
            '📌 Giày Adidas Ultraboost - Giá: 5.000.000đ',
            '• Trả góp 6 tháng: 833.333đ/tháng (0% lãi suất)',
            '• Trả góp 12 tháng: 416.667đ/tháng (0% lãi suất)',
          ],
        },
        {
          title: 'Lưu ý',
          content: [
            '⚠️ Không áp dụng cùng với các chương trình khuyến mãi khác',
            '⚠️ Hồ sơ trả góp cần có ảnh CMND/CCCD rõ nét',
            '⚠️ Thời gian duyệt phụ thuộc vào đối tác tài chính',
            '⚠️ Trả góp qua thẻ tín dụng chịu phí theo quy định ngân hàng',
            '⚠️ Liên hệ hotline 1900 xxxx để được tư vấn chi tiết',
          ],
        },
      ]}
    />
  )
}
