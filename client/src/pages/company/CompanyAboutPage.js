import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import './CompanyAboutPage.css'

const CompanyAboutPage = () => {
  return (
    <div className="company-about-page">
      {/* Hero Section */}
      <motion.section
        className="about-hero"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="about-hero-overlay"></div>
        <div className="about-hero-content">
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            VỀ LAPTOP STORE VIETNAM
          </motion.h1>
          <motion.p
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            Đối tác tin cậy cho mọi nhu cầu công nghệ của bạn
          </motion.p>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="about-story">
        <div className="container">
          <motion.div
            className="story-content"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2>📖 Câu chuyện của chúng tôi</h2>
            <p className="story-intro">
              Laptop Store Vietnam được thành lập năm 2020 với sứ mệnh mang đến những sản phẩm
              laptop chất lượng cao và dịch vụ khách hàng xuất sắc cho người dùng Việt Nam.
            </p>
            <p>
              Từ một cửa hàng nhỏ tại Hà Nội, chúng tôi đã phát triển thành một trong những hệ thống
              bán lẻ laptop uy tín nhất cả nước. Với hơn <strong>50,000+ khách hàng</strong> đã tin
              tưởng, <strong>200+ đối tác</strong> chiến lược và <strong>15 chi nhánh</strong> trên
              toàn quốc, chúng tôi tự hào là điểm đến hàng đầu cho mọi nhu cầu laptop.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="about-vision-mission">
        <div className="container">
          <div className="vm-grid">
            <motion.div
              className="vm-card"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="vm-icon">🎯</div>
              <h3>Tầm nhìn</h3>
              <p>
                Trở thành nền tảng thương mại điện tử laptop hàng đầu Việt Nam, kết nối người dùng
                với các sản phẩm công nghệ chất lượng cao nhất.
              </p>
            </motion.div>

            <motion.div
              className="vm-card"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <div className="vm-icon">🚀</div>
              <h3>Sứ mệnh</h3>
              <p>
                Cung cấp trải nghiệm mua sắm laptop tốt nhất với giá cả hợp lý, dịch vụ chuyên
                nghiệp và cam kết bảo hành chu đáo.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="about-values">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            💎 Giá trị cốt lõi
          </motion.h2>

          <div className="values-grid">
            {[
              { icon: '✅', title: 'Uy tín', desc: 'Sản phẩm chính hãng 100%, bảo hành đầy đủ' },
              { icon: '💰', title: 'Giá tốt', desc: 'Cam kết giá cạnh tranh nhất thị trường' },
              { icon: '🎁', title: 'Chất lượng', desc: 'Kiểm tra kỹ lưỡng trước khi giao hàng' },
              { icon: '🚚', title: 'Giao nhanh', desc: 'Giao hàng toàn quốc trong 24-48h' },
              { icon: '💬', title: 'Tư vấn', desc: 'Đội ngũ chuyên gia sẵn sàng hỗ trợ 24/7' },
              { icon: '🔧', title: 'Bảo hành', desc: 'Chế độ bảo hành tận tâm, đổi mới nếu lỗi' },
            ].map((value, index) => (
              <motion.div
                key={index}
                className="value-card"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(99,102,241,0.2)' }}
              >
                <div className="value-icon">{value.icon}</div>
                <h4>{value.title}</h4>
                <p>{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="about-stats">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            📊 Con số ấn tượng
          </motion.h2>

          <div className="stats-grid">
            {[
              { number: '50,000+', label: 'Khách hàng hài lòng' },
              { number: '200+', label: 'Đối tác chiến lược' },
              { number: '15', label: 'Chi nhánh toàn quốc' },
              { number: '10,000+', label: 'Sản phẩm đa dạng' },
              { number: '24/7', label: 'Hỗ trợ khách hàng' },
              { number: '99%', label: 'Tỷ lệ hài lòng' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                className="stat-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
              >
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="about-team">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            👥 Đội ngũ lãnh đạo
          </motion.h2>

          <div className="team-grid">
            {[
              {
                name: 'Trịnh Việt Hoàng',
                position: 'CEO & Founder',
              },
              {
                name: 'Trịnh Việt Hoàng',
                position: 'CFO',
              },
              {
                name: 'Trịnh Việt Hoàng',
                position: 'CTO',
              },
              {
                name: 'Trịnh Việt Hoàng',
                position: 'CMO',
              },
            ].map((member, index) => (
              <motion.div
                key={index}
                className="team-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -10 }}
              >
                <h4>{member.name}</h4>
                <p>{member.position}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="about-partners">
        <div className="container">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            🤝 Đối tác & Chứng nhận
          </motion.h2>

          <div className="partners-grid">
            {['Dell', 'HP', 'Lenovo', 'Asus', 'Acer', 'Apple', 'MSI', 'Samsung'].map(
              (partner, index) => (
                <motion.div
                  key={index}
                  className="partner-logo"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  <span>{partner}</span>
                </motion.div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>Bắt đầu mua sắm ngay hôm nay!</h2>
            <p>Khám phá hàng nghìn sản phẩm laptop chất lượng cao với giá tốt nhất</p>
            <div className="cta-buttons">
              <Link to="/" className="cta-btn primary">
                🛒 Mua sắm ngay
              </Link>
              <Link to="/contact" className="cta-btn secondary">
                📞 Liên hệ tư vấn
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default CompanyAboutPage
