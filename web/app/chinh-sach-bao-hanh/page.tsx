import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Chính Sách Bảo Hành | Shoe Store',
  description: 'Chính sách bảo hành sản phẩm giày dép tại Shoe Store',
}

export default function Page() {
  return (
    <GenericPage
      title="Chính Sách Bảo Hành"
      icon="🛡️"
      description="Shoe Store cam kết bảo hành chất lượng sản phẩm cho khách hàng."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Điều kiện bảo hành',
          content: [
            'Sản phẩm còn trong thời hạn bảo hành (6 tháng kể từ ngày mua)',
            'Có hóa đơn mua hàng hoặc thông tin đơn hàng trên hệ thống',
            'Lỗi do nhà sản xuất: bung keo, đứt chỉ, bong tróc không do tác động ngoại lực',
            'Sản phẩm chưa qua sửa chữa, thay đổi bởi bên thứ ba',
          ],
        },
        {
          title: 'Các trường hợp không được bảo hành',
          content: [
            'Hư hỏng do sử dụng sai mục đích',
            'Mòn đế, phai màu do quá trình sử dụng bình thường',
            'Hư hỏng do tác động ngoại lực: cắt, rách, cháy, ngâm nước',
            'Sản phẩm đã hết thời hạn bảo hành',
            'Không có thông tin đơn hàng hoặc hóa đơn mua hàng',
          ],
        },
        {
          title: 'Quy trình bảo hành',
          content: [
            'Bước 1: Liên hệ hotline 1900.xxxx hoặc email support@shoestore.vn',
            'Bước 2: Cung cấp mã đơn hàng và hình ảnh sản phẩm lỗi',
            'Bước 3: Gửi sản phẩm về cửa hàng hoặc qua đường bưu điện',
            'Bước 4: Kiểm tra và xác nhận trong vòng 3-5 ngày làm việc',
            'Bước 5: Sửa chữa hoặc đổi sản phẩm mới (nếu không sửa được)',
          ],
        },
        {
          title: 'Thời gian xử lý',
          content: 'Thời gian bảo hành trung bình từ 5-10 ngày làm việc tùy theo mức độ hư hỏng. Trường hợp cần đổi sản phẩm mới, thời gian có thể kéo dài 10-15 ngày nếu sản phẩm hết hàng tại kho.',
        },
        {
          title: 'Liên hệ bảo hành',
          content: [
            'Hotline: 1900.xxxx (8:00 - 21:00, T2-CN)',
            'Email: warranty@shoestore.vn',
            'Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
          ],
        },
      ]}
    />
  )
}
