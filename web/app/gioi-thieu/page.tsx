import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Giới Thiệu | Shoe Store',
  description: 'Về chúng tôi - Shoe Store, hệ thống cửa hàng giày dép uy tín hàng đầu Việt Nam',
}

export default function Page() {
  return (
    <GenericPage
      title="Giới Thiệu Về Shoe Store"
      icon="👟"
      description="Hệ thống cửa hàng giày dép chính hãng uy tín hàng đầu Việt Nam với hơn 10 năm kinh nghiệm."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Về chúng tôi',
          content: [
            'Shoe Store được thành lập từ năm 2016, với sứ mệnh mang đến những đôi giày chất lượng cao, phong cách và giá cả hợp lý cho người Việt.',
            'Với hơn 10 năm kinh nghiệm trong ngành, chúng tôi tự hào là đối tác chính thức của nhiều thương hiệu giày dép nổi tiếng thế giới.',
            'Hiện tại, Shoe Store có mặt tại 8 tỉnh thành lớn với hơn 15 cửa hàng trên toàn quốc.',
          ],
        },
        {
          title: 'Tầm nhìn & Sứ mệnh',
          content: [
            'Tầm nhìn: Trở thành hệ thống bán lẻ giày dép số 1 Việt Nam, được khách hàng tin tưởng và yêu thích.',
            'Sứ mệnh: Mang đến trải nghiệm mua sắm tuyệt vời với sản phẩm chính hãng, dịch vụ chuyên nghiệp và giá cả cạnh tranh.',
          ],
        },
        {
          title: 'Tại sao chọn Shoe Store?',
          content: [
            '✓ 100% sản phẩm chính hãng, có tem chống giả',
            '✓ Bảo hành 12 tháng, đổi trả trong 30 ngày',
            '✓ Miễn phí vận chuyển đơn hàng từ 500.000đ',
            '✓ Đội ngũ tư vấn chuyên nghiệp, nhiệt tình',
            '✓ Chương trình khuyến mãi và tích điểm hấp dẫn',
            '✓ Hơn 10.000 mẫu giày đa dạng phong cách',
          ],
        },
        {
          title: 'Đội ngũ của chúng tôi',
          content: 'Shoe Store tự hào có đội ngũ nhân viên trẻ trung, năng động, được đào tạo bài bản về sản phẩm và kỹ năng phục vụ khách hàng. Chúng tôi luôn sẵn sàng tư vấn và hỗ trợ bạn tìm được đôi giày hoàn hảo nhất.',
        },
        {
          title: 'Liên hệ hợp tác',
          content: [
            'Email: partnership@shoestore.vn',
            'Hotline: 1900 xxxx',
            'Địa chỉ: 123 Nguyễn Huệ, Quận 1, TP.HCM',
          ],
        },
      ]}
    />
  )
}
