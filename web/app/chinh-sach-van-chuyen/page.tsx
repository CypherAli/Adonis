import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Chính Sách Vận Chuyển | Shoe Store',
  description: 'Thông tin vận chuyển, phí ship và thời gian giao hàng tại Shoe Store',
}

export default function Page() {
  return (
    <GenericPage
      title="Chính Sách Vận Chuyển"
      icon="🚚"
      description="Miễn phí vận chuyển cho đơn hàng từ 500.000đ. Giao hàng toàn quốc 2-5 ngày."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Phí vận chuyển',
          content: [
            'Đơn hàng từ 500.000đ: MIỄN PHÍ vận chuyển toàn quốc',
            'Đơn hàng dưới 500.000đ: phí ship 30.000đ',
            'Giao hàng nhanh (nội thành HCM, Hà Nội): +15.000đ, nhận trong 2-4 giờ',
          ],
        },
        {
          title: 'Thời gian giao hàng',
          content: [
            'Nội thành TP.HCM, Hà Nội: 1-2 ngày làm việc',
            'Các tỉnh thành lân cận: 2-3 ngày làm việc',
            'Các tỉnh thành khác: 3-5 ngày làm việc',
            'Vùng sâu, vùng xa, hải đảo: 5-7 ngày làm việc',
          ],
        },
        {
          title: 'Đối tác vận chuyển',
          content: [
            'GHN (Giao Hàng Nhanh) - Đối tác chính',
            'GHTK (Giao Hàng Tiết Kiệm)',
            'J&T Express',
            'Viettel Post',
          ],
        },
        {
          title: 'Theo dõi đơn hàng',
          content: 'Sau khi đơn hàng được gửi đi, bạn sẽ nhận được mã vận đơn qua email và SMS. Bạn có thể theo dõi tình trạng đơn hàng trong mục "Đơn hàng của tôi" trên website.',
        },
        {
          title: 'Lưu ý quan trọng',
          content: [
            'Vui lòng kiểm tra hàng trước khi nhận. Nếu phát hiện hư hỏng, từ chối nhận và liên hệ ngay với chúng tôi.',
            'Thời gian giao hàng có thể thay đổi vào các dịp lễ, Tết hoặc khi có thiên tai.',
            'Đơn hàng đặt sau 15:00 sẽ được xử lý vào ngày làm việc tiếp theo.',
          ],
        },
      ]}
    />
  )
}
