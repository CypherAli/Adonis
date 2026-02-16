import GenericPage from '@/components/common/GenericPage'

export const metadata = {
  title: 'Tuyển Dụng | Shoe Store',
  description: 'Cơ hội nghề nghiệp tại Shoe Store - Gia nhập đội ngũ của chúng tôi',
}

export default function Page() {
  return (
    <GenericPage
      title="Tuyển Dụng"
      icon="💼"
      description="Gia nhập đội ngũ Shoe Store - Nơi đam mê sneakers gặp gỡ cơ hội nghề nghiệp."
      lastUpdated="15/02/2026"
      sections={[
        {
          title: 'Tại sao chọn Shoe Store?',
          content: [
            'Môi trường làm việc trẻ trung, năng động, đầy sáng tạo',
            'Chế độ lương thưởng cạnh tranh, thưởng KPI hàng quý',
            'Được đào tạo và phát triển kỹ năng chuyên môn',
            'Giảm giá nhân viên lên đến 40% cho tất cả sản phẩm',
            'Team building, du lịch hàng năm',
          ],
        },
        {
          title: 'Vị trí đang tuyển - Nhân viên bán hàng',
          content: [
            'Số lượng: 5 người (HCM: 3, HN: 2)',
            'Yêu cầu: Giao tiếp tốt, yêu thích thời trang & sneakers',
            'Lương: 8-12 triệu + hoa hồng',
            'Thời gian: Full-time, ca xoay',
          ],
        },
        {
          title: 'Vị trí đang tuyển - Marketing Online',
          content: [
            'Số lượng: 2 người',
            'Yêu cầu: Kinh nghiệm Facebook Ads, Google Ads, content marketing',
            'Lương: 12-18 triệu + thưởng hiệu quả',
            'Thời gian: Full-time, Thứ 2 - Thứ 6',
          ],
        },
        {
          title: 'Vị trí đang tuyển - Lập trình viên Web',
          content: [
            'Số lượng: 2 người',
            'Yêu cầu: Kinh nghiệm ReactJS/NextJS, NodeJS. Có kiến thức về NestJS là lợi thế.',
            'Lương: 15-30 triệu tùy kinh nghiệm',
            'Thời gian: Full-time, remote 2 ngày/tuần',
          ],
        },
        {
          title: 'Cách ứng tuyển',
          content: [
            'Gửi CV qua email: hr@shoestore.vn',
            'Tiêu đề email: [Vị trí] - Họ tên ứng viên',
            'Hoặc nộp trực tiếp tại cửa hàng gần nhất',
            'Thời gian phản hồi: trong vòng 3 ngày làm việc',
          ],
        },
      ]}
    />
  )
}
