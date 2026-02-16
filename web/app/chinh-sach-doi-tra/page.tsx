import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Chính Sách Đổi Trả | Shoe Store',
  description: 'Chính sách đổi trả sản phẩm tại Shoe Store - Đổi trả miễn phí trong 30 ngày',
}

export default function Page() {
  return (
    <GenericPage
      title="Chính Sách Đổi Trả"
      icon="↩️"
      description="Đổi trả miễn phí trong 30 ngày - Shoe Store luôn đặt quyền lợi khách hàng lên hàng đầu."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Điều kiện đổi trả',
          content: [
            'Trong vòng 30 ngày kể từ ngày nhận hàng',
            'Sản phẩm còn nguyên tem, nhãn mác, hộp đựng',
            'Chưa qua sử dụng, chưa giặt, không có mùi',
            'Có hóa đơn hoặc mã đơn hàng',
          ],
        },
        {
          title: 'Các trường hợp được đổi trả',
          content: [
            'Sản phẩm bị lỗi từ nhà sản xuất',
            'Giao sai mẫu, sai size, sai màu so với đơn hàng',
            'Sản phẩm không đúng mô tả trên website',
            'Đổi size trong vòng 7 ngày (miễn phí 1 lần)',
          ],
        },
        {
          title: 'Phương thức hoàn tiền',
          content: [
            'Hoàn tiền qua tài khoản ngân hàng: 3-5 ngày làm việc',
            'Hoàn tiền vào ví Shoe Store: ngay lập tức',
            'Đổi sang sản phẩm khác: bù/trả chênh lệch nếu khác giá',
            'Phí vận chuyển đổi trả: miễn phí nếu lỗi từ shop, khách chịu nếu đổi ý',
          ],
        },
        {
          title: 'Quy trình đổi trả',
          content: [
            'Bước 1: Vào trang "Đơn hàng của tôi", chọn đơn cần đổi trả',
            'Bước 2: Chọn lý do đổi trả và chụp ảnh sản phẩm',
            'Bước 3: Chờ xác nhận từ bộ phận CSKH (trong 24 giờ)',
            'Bước 4: Gửi hàng về theo hướng dẫn hoặc mang đến cửa hàng',
            'Bước 5: Nhận hàng mới hoặc hoàn tiền sau khi kiểm tra',
          ],
        },
      ]}
    />
  )
}
