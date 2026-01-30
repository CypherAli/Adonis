import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { FiMapPin, FiPhone, FiClock, FiNavigation } from 'react-icons/fi'
import './StoresPage.css'

const StoresPage = () => {
  const [selectedCity, setSelectedCity] = useState('all')

  const cities = ['all', 'hanoi', 'hcm', 'danang', 'haiphong', 'cantho']
  const cityNames = {
    all: 'Tất cả',
    hanoi: 'Hà Nội',
    hcm: 'TP. Hồ Chí Minh',
    danang: 'Đà Nẵng',
    haiphong: 'Hải Phòng',
    cantho: 'Cần Thơ',
  }

  const stores = [
    {
      id: 1,
      name: 'Laptop Store Hà Nội - Trung tâm',
      city: 'hanoi',
      address: '123 Đường Láng, Đống Đa, Hà Nội',
      phone: '084.686.5650',
      hours: '8:00 - 21:00',
      image: '🏢',
      mapLink: 'https://maps.google.com',
      features: ['Showroom lớn', 'Trải nghiệm sản phẩm', 'Bảo hành tại chỗ'],
    },
    {
      id: 2,
      name: 'Laptop Store HCM - Quận 1',
      city: 'hcm',
      address: '456 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh',
      phone: '084.686.5651',
      hours: '8:00 - 22:00',
      image: '🏬',
      mapLink: 'https://maps.google.com',
      features: ['Vị trí trung tâm', 'Giao hàng nhanh', 'Tư vấn 24/7'],
    },
    {
      id: 3,
      name: 'Laptop Store Đà Nẵng',
      city: 'danang',
      address: '789 Trần Phú, Hải Châu, Đà Nẵng',
      phone: '084.686.5652',
      hours: '8:00 - 21:00',
      image: '🏪',
      mapLink: 'https://maps.google.com',
      features: ['Gần sân bay', 'Parking miễn phí', 'Demo đầy đủ'],
    },
    {
      id: 4,
      name: 'Laptop Store Hải Phòng',
      city: 'haiphong',
      address: '321 Điện Biên Phủ, Hồng Bàng, Hải Phòng',
      phone: '084.686.5653',
      hours: '8:00 - 20:30',
      image: '🏛️',
      mapLink: 'https://maps.google.com',
      features: ['Showroom hiện đại', 'Giá tốt nhất', 'Hỗ trợ trả góp'],
    },
    {
      id: 5,
      name: 'Laptop Store Cần Thơ',
      city: 'cantho',
      address: '555 Trần Hưng Đạo, Ninh Kiều, Cần Thơ',
      phone: '084.686.5654',
      hours: '8:00 - 21:00',
      image: '🏗️',
      mapLink: 'https://maps.google.com',
      features: ['Phục vụ miền Tây', 'Giao hàng nhanh', 'Bảo hành tốt'],
    },
  ]

  const filteredStores =
    selectedCity === 'all' ? stores : stores.filter((store) => store.city === selectedCity)

  return (
    <div className="stores-page">
      {/* Hero */}
      <motion.section className="stores-hero" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="stores-hero-content">
          <motion.h1
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            🏪 Hệ Thống Cửa Hàng
          </motion.h1>
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {stores.length} chi nhánh trên toàn quốc - Sẵn sàng phục vụ bạn
          </motion.p>
        </div>
      </motion.section>

      {/* City Filter */}
      <section className="stores-filter">
        <div className="container">
          <h2>📍 Chọn thành phố</h2>
          <div className="city-buttons">
            {cities.map((city, index) => (
              <motion.button
                key={city}
                className={`city-btn ${selectedCity === city ? 'active' : ''}`}
                onClick={() => setSelectedCity(city)}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05 }}
              >
                {cityNames[city]}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Stores List */}
      <section className="stores-list-section">
        <div className="container">
          <div className="stores-grid">
            {filteredStores.map((store, index) => (
              <motion.div
                key={store.id}
                className="store-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <div className="store-image">
                  <div className="store-icon">{store.image}</div>
                </div>

                <div className="store-info">
                  <h3>{store.name}</h3>

                  <div className="store-details">
                    <div className="store-detail">
                      <FiMapPin className="detail-icon" />
                      <span>{store.address}</span>
                    </div>

                    <div className="store-detail">
                      <FiPhone className="detail-icon" />
                      <a href={`tel:${store.phone}`}>{store.phone}</a>
                    </div>

                    <div className="store-detail">
                      <FiClock className="detail-icon" />
                      <span>{store.hours} (Tất cả các ngày)</span>
                    </div>
                  </div>

                  <div className="store-features">
                    {store.features.map((feature, idx) => (
                      <span key={idx} className="feature-badge">
                        ✓ {feature}
                      </span>
                    ))}
                  </div>

                  <a
                    href={store.mapLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="direction-btn"
                  >
                    <FiNavigation /> Chỉ đường
                  </a>
                </div>
              </motion.div>
            ))}
          </div>

          {filteredStores.length === 0 && (
            <div className="no-stores">
              <p>🔍 Chưa có cửa hàng tại thành phố này</p>
            </div>
          )}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="stores-cta">
        <div className="container">
          <motion.div
            className="cta-content"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2>🎯 Không tìm thấy cửa hàng gần bạn?</h2>
            <p>Đừng lo! Chúng tôi giao hàng toàn quốc trong 24-48h</p>
            <a href="tel:0846865650" className="cta-btn">
              📞 Gọi ngay 084.686.5650
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}

export default StoresPage
