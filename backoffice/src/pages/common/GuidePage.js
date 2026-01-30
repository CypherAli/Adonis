import React from 'react'
import { FiShoppingCart, FiCreditCard, FiPackage, FiCheckCircle } from 'react-icons/fi'
import './GuidePage.css'

const GuidePage = () => {
  return (
    <div className="guide-page">
      <div className="guide-container">
        {/* Hero Section */}
        <div className="guide-hero">
          <h1>📖 Hướng Dẫn Mua Hàng</h1>
          <p>Mua sắm laptop dễ dàng chỉ với 4 bước đơn giản</p>
        </div>

        {/* Steps Section */}
        <div className="guide-steps">
          <div className="guide-step">
            <div className="step-icon step-1">
              <FiShoppingCart />
            </div>
            <div className="step-content">
              <h3>Bước 1: Chọn Sản Phẩm</h3>
              <ul>
                <li>Tìm kiếm laptop phù hợp qua thanh tìm kiếm hoặc danh mục</li>
                <li>Sử dụng bộ lọc để lọc theo giá, thương hiệu, cấu hình</li>
                <li>Xem chi tiết sản phẩm: thông số kỹ thuật, hình ảnh, đánh giá</li>
                <li>So sánh nhiều sản phẩm để chọn được laptop ưng ý nhất</li>
                <li>Click "Thêm vào giỏ hàng" hoặc "Mua ngay"</li>
              </ul>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-icon step-2">
              <FiCreditCard />
            </div>
            <div className="step-content">
              <h3>Bước 2: Đặt Hàng & Thanh Toán</h3>
              <ul>
                <li>Kiểm tra giỏ hàng, số lượng và tổng tiền</li>
                <li>Nhập thông tin giao hàng: họ tên, số điện thoại, địa chỉ</li>
                <li>
                  Chọn phương thức thanh toán:
                  <ul className="sub-list">
                    <li>💳 Thanh toán online (Visa, Mastercard, ATM)</li>
                    <li>📱 Ví điện tử (ZaloPay, MoMo)</li>
                    <li>💵 Thanh toán khi nhận hàng (COD)</li>
                  </ul>
                </li>
                <li>Nhập mã giảm giá nếu có</li>
                <li>Xác nhận đơn hàng</li>
              </ul>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-icon step-3">
              <FiPackage />
            </div>
            <div className="step-content">
              <h3>Bước 3: Theo Dõi Đơn Hàng</h3>
              <ul>
                <li>Nhận email/SMS xác nhận đơn hàng</li>
                <li>Đăng nhập tài khoản để theo dõi trạng thái đơn hàng</li>
                <li>Nhận thông báo khi đơn hàng được xử lý và giao đi</li>
                <li>
                  Liên hệ hotline <strong>084.686.5650</strong> nếu cần hỗ trợ
                </li>
              </ul>
            </div>
          </div>

          <div className="guide-step">
            <div className="step-icon step-4">
              <FiCheckCircle />
            </div>
            <div className="step-content">
              <h3>Bước 4: Nhận Hàng & Đánh Giá</h3>
              <ul>
                <li>Kiểm tra kỹ sản phẩm trước khi nhận hàng</li>
                <li>Được đồng kiểm, test máy cùng nhân viên giao hàng</li>
                <li>Từ chối nhận hàng nếu phát hiện lỗi hoặc không đúng yêu cầu</li>
                <li>Thanh toán (nếu chọn COD)</li>
                <li>Đánh giá sản phẩm để nhận điểm thưởng</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Tips Section */}
        <div className="guide-tips">
          <h2>💡 Mẹo Mua Hàng Thông Minh</h2>
          <div className="tips-grid">
            <div className="tip-card">
              <span className="tip-icon">🎯</span>
              <h4>Xác định nhu cầu</h4>
              <p>Chọn laptop phù hợp với mục đích sử dụng: học tập, văn phòng, gaming, đồ họa...</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">💰</span>
              <h4>So sánh giá</h4>
              <p>Sử dụng tính năng so sánh để chọn laptop có cấu hình tốt nhất trong tầm giá</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">⭐</span>
              <h4>Đọc đánh giá</h4>
              <p>Tham khảo đánh giá từ người dùng khác để có cái nhìn khách quan về sản phẩm</p>
            </div>
            <div className="tip-card">
              <span className="tip-icon">🎁</span>
              <h4>Săn khuyến mãi</h4>
              <p>Theo dõi các chương trình khuyến mãi, flash sale để mua được giá tốt nhất</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="guide-faq">
          <h2>❓ Câu Hỏi Thường Gặp</h2>
          <div className="faq-simple">
            <div className="faq-item-simple">
              <h4>Tôi có thể đổi ý sau khi đặt hàng không?</h4>
              <p>
                Có, bạn có thể hủy đơn hàng miễn phí nếu đơn hàng chưa được xử lý. Liên hệ ngay
                hotline để được hỗ trợ.
              </p>
            </div>
            <div className="faq-item-simple">
              <h4>Có được mở hộp kiểm tra khi nhận hàng không?</h4>
              <p>Có, bạn được quyền mở hộp, kiểm tra sản phẩm và test máy trước khi nhận hàng.</p>
            </div>
            <div className="faq-item-simple">
              <h4>Làm sao để nhận được hóa đơn VAT?</h4>
              <p>Tick vào ô "Xuất hóa đơn VAT" khi đặt hàng và điền đầy đủ thông tin công ty.</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="guide-cta">
          <h2>Bạn cần hỗ trợ?</h2>
          <p>Đội ngũ tư vấn của chúng tôi luôn sẵn sàng hỗ trợ 24/7</p>
          <div className="cta-buttons">
            <a href="tel:0846865650" className="cta-btn primary">
              📞 Gọi ngay: 084.686.5650
            </a>
            <a href="/contact" className="cta-btn secondary">
              💬 Chat với chúng tôi
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GuidePage
