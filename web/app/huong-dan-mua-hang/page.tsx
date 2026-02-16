import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Hướng Dẫn Mua Hàng | Shoe Store',
  description: 'Hướng dẫn chi tiết cách đặt hàng và mua sắm tại Shoe Store',
}

export default function Page() {
  return (
    <GenericPage
      title="Hướng Dẫn Mua Hàng"
      icon="🛒"
      description="Mua sắm dễ dàng chỉ với 5 bước đơn giản. Hỗ trợ 24/7 qua hotline và chat."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Bước 1: Tìm kiếm sản phẩm',
          content: [
            'Sử dụng thanh tìm kiếm hoặc duyệt theo danh mục: Giày thể thao, Giày cao gót, Giày da...',
            'Lọc sản phẩm theo: Thương hiệu, Giá, Màu sắc, Size, Đánh giá',
            'Xem chi tiết sản phẩm: Hình ảnh, mô tả, đánh giá từ khách hàng',
          ],
        },
        {
          title: 'Bước 2: Chọn size và số lượng',
          content: [
            'Chọn size phù hợp (tham khảo bảng size chi tiết)',
            'Chọn màu sắc và số lượng mong muốn',
            'Nhấn "Thêm vào giỏ hàng" hoặc "Mua ngay"',
          ],
        },
        {
          title: 'Bước 3: Kiểm tra giỏ hàng',
          content: [
            'Xem lại các sản phẩm đã chọn trong giỏ hàng',
            'Cập nhật số lượng hoặc xóa sản phẩm nếu cần',
            'Nhập mã giảm giá (nếu có)',
            'Nhấn "Tiến hành thanh toán"',
          ],
        },
        {
          title: 'Bước 4: Điền thông tin giao hàng',
          content: [
            'Nhập họ tên, số điện thoại, email',
            'Nhập địa chỉ giao hàng chi tiết',
            'Chọn phương thức vận chuyển: Tiêu chuẩn (2-5 ngày) hoặc Nhanh (2-4 giờ)',
            'Ghi chú đơn hàng (nếu có)',
          ],
        },
        {
          title: 'Bước 5: Thanh toán và hoàn tất',
          content: [
            'Chọn phương thức thanh toán: COD, Chuyển khoản, Thẻ, Ví điện tử',
            'Kiểm tra lại toàn bộ thông tin đơn hàng',
            'Nhấn "Đặt hàng" để hoàn tất',
            'Bạn sẽ nhận được email xác nhận đơn hàng',
          ],
        },
        {
          title: 'Lưu ý khi mua hàng',
          content: [
            '💡 Tạo tài khoản để theo dõi đơn hàng và nhận ưu đãi',
            '💡 Kiểm tra kỹ size trước khi đặt - tham khảo bảng size hoặc gọi hotline',
            '💡 Đọc chính sách đổi trả để hiểu quyền lợi của bạn',
            '💡 Lưu lại mã đơn hàng để tra cứu khi cần',
          ],
        },
      ]}
    />
  )
}
