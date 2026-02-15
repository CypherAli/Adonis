import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Hệ Thống Cửa Hàng | Shoe Store',
  description: 'Danh sách các cửa hàng Shoe Store trên toàn quốc - TP.HCM, Hà Nội, Đà Nẵng',
}

export default function Page() {
  return (
    <GenericPage
      title="Hệ Thống Cửa Hàng"
      icon="🏪"
      description="Hơn 15 cửa hàng trên toàn quốc, sẵn sàng phục vụ bạn với đội ngũ nhân viên chuyên nghiệp."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'TP. Hồ Chí Minh',
          content: [
            '📍 CN1: 123 Nguyễn Huệ, Q.1 - Tel: (028) 3822 xxxx',
            '📍 CN2: 456 Trần Hưng Đạo, Q.5 - Tel: (028) 3855 xxxx',
            '📍 CN3: 789 Lê Văn Việt, Q.9 - Tel: (028) 3896 xxxx',
            '📍 CN4: 321 Võ Văn Ngân, Thủ Đức - Tel: (028) 3725 xxxx',
          ],
        },
        {
          title: 'Hà Nội',
          content: [
            '📍 CN5: 100 Hoàn Kiếm, Q. Hoàn Kiếm - Tel: (024) 3826 xxxx',
            '📍 CN6: 200 Cầu Giấy, Q. Cầu Giấy - Tel: (024) 3754 xxxx',
            '📍 CN7: 300 Hai Bà Trưng, Q. Hai Bà Trưng - Tel: (024) 3622 xxxx',
          ],
        },
        {
          title: 'Đà Nẵng',
          content: [
            '📍 CN8: 50 Trần Phú, Q. Hải Châu - Tel: (0236) 3821 xxxx',
          ],
        },
        {
          title: 'Dịch vụ tại cửa hàng',
          content: [
            '✓ Tư vấn và thử giày miễn phí',
            '✓ Kiểm tra chân 3D để chọn size chính xác',
            '✓ Vệ sinh và bảo dưỡng giày',
            '✓ Đổi trả hàng trực tiếp',
            '✓ Thanh toán đa dạng: Tiền mặt, thẻ, ví điện tử',
            '✓ Nhận hàng đặt online tại cửa hàng',
          ],
        },
        {
          title: 'Giờ làm việc',
          content: [
            'Thứ 2 - Thứ 6: 9:00 - 21:00',
            'Thứ 7 - Chủ nhật: 8:30 - 22:00',
            'Các ngày lễ, Tết: 10:00 - 20:00',
          ],
        },
      ]}
    />
  )
}
