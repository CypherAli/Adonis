import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Điều Khoản Sử Dụng | Shoe Store',
  description: 'Điều khoản và điều kiện sử dụng website Shoe Store',
}

export default function Page() {
  return (
    <GenericPage
      title="Điều Khoản Sử Dụng"
      icon="📋"
      description="Các quy định và điều khoản khi sử dụng dịch vụ tại Shoe Store."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Điều khoản chung',
          content: [
            'Bằng việc truy cập và sử dụng website này, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng.',
            'Chúng tôi có quyền thay đổi, chỉnh sửa các điều khoản bất cứ lúc nào mà không cần thông báo trước.',
            'Việc bạn tiếp tục sử dụng website sau khi có thay đổi đồng nghĩa với việc bạn chấp nhận các thay đổi đó.',
          ],
        },
        {
          title: 'Quy định về tài khoản',
          content: [
            'Bạn phải đủ 18 tuổi hoặc có sự đồng ý của cha mẹ/người giám hộ để tạo tài khoản.',
            'Thông tin đăng ký phải chính xác, đầy đủ và cập nhật.',
            'Bạn chịu trách nhiệm bảo mật thông tin tài khoản và mật khẩu của mình.',
            'Nghiêm cấm việc sử dụng tài khoản cho mục đích bất hợp pháp.',
          ],
        },
        {
          title: 'Quy định về đặt hàng',
          content: [
            'Giá sản phẩm có thể thay đổi mà không cần báo trước.',
            'Chúng tôi có quyền từ chối hoặc hủy đơn hàng trong các trường hợp: thông tin không chính xác, hành vi gian lận, hoặc sản phẩm hết hàng.',
            'Khách hàng vui lòng kiểm tra kỹ thông tin đơn hàng trước khi xác nhận thanh toán.',
          ],
        },
        {
          title: 'Quyền sở hữu trí tuệ',
          content: 'Toàn bộ nội dung trên website bao gồm văn bản, hình ảnh, logo, và các tài liệu khác thuộc quyền sở hữu của Shoe Store. Nghiêm cấm mọi hành vi sao chép, sử dụng lại mà không có sự cho phép bằng văn bản.',
        },
        {
          title: 'Chính sách bảo mật',
          content: 'Chúng tôi cam kết bảo vệ thông tin cá nhân của khách hàng. Thông tin chi tiết được quy định tại Chính Sách Bảo Mật riêng biệt trên website.',
        },
        {
          title: 'Liên hệ',
          content: 'Nếu có bất kỳ thắc mắc nào về Điều Khoản Sử Dụng, vui lòng liên hệ qua email: support@shoestore.vn hoặc hotline: 1900 xxxx.',
        },
      ]}
    />
  )
}
