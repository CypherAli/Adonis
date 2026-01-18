import React from 'react';
import '../styles/PolicyPage.css';

const ShippingPolicyPage = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <div className="policy-hero shipping">
                    <h1>🚚 Chính Sách Vận Chuyển</h1>
                    <p>Giao hàng nhanh - An toàn - Miễn phí</p>
                </div>

                <div className="policy-content">
                    <section className="policy-section">
                        <h2>📍 Khu Vực Giao Hàng</h2>
                        <div className="shipping-zones">
                            <div className="zone-card">
                                <h4>🏙️ Nội thành Hà Nội</h4>
                                <p className="zone-time">2-4 giờ</p>
                                <p className="zone-fee">Miễn phí từ 3 triệu</p>
                                <p className="zone-detail">30,000₫ nếu dưới 3 triệu</p>
                            </div>
                            <div className="zone-card">
                                <h4>🌆 Các tỉnh lân cận</h4>
                                <p className="zone-time">1-2 ngày</p>
                                <p className="zone-fee">Miễn phí từ 5 triệu</p>
                                <p className="zone-detail">50,000₫ nếu dưới 5 triệu</p>
                            </div>
                            <div className="zone-card">
                                <h4>🗺️ Toàn quốc</h4>
                                <p className="zone-time">2-3 ngày</p>
                                <p className="zone-fee">Miễn phí từ 5 triệu</p>
                                <p className="zone-detail">Phí vận chuyển theo khu vực</p>
                            </div>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>📦 Đóng Gói & Giao Hàng</h2>
                        <div className="info-box">
                            <ul>
                                <li>Đóng gói cẩn thận với hộp carton chuyên dụng</li>
                                <li>Bọc nilon chống nước, chống va đập</li>
                                <li>Giao hàng bởi đội ngũ shipper chuyên nghiệp</li>
                                <li>Bảo hiểm 100% giá trị sản phẩm</li>
                                <li>Được kiểm tra hàng trước khi nhận</li>
                            </ul>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>🔍 Kiểm Tra Hàng</h2>
                        <div className="check-steps">
                            <div className="check-item">
                                <span className="check-icon">📦</span>
                                <div>
                                    <h4>Kiểm tra bên ngoài</h4>
                                    <p>Hộp nguyên vẹn, không bị móp méo</p>
                                </div>
                            </div>
                            <div className="check-item">
                                <span className="check-icon">🔓</span>
                                <div>
                                    <h4>Mở hộp kiểm tra</h4>
                                    <p>Sản phẩm đúng mô tả, đầy đủ phụ kiện</p>
                                </div>
                            </div>
                            <div className="check-item">
                                <span className="check-icon">⚡</span>
                                <div>
                                    <h4>Test máy</h4>
                                    <p>Bật máy, kiểm tra hoạt động</p>
                                </div>
                            </div>
                            <div className="check-item">
                                <span className="check-icon">✅</span>
                                <div>
                                    <h4>Nhận hàng</h4>
                                    <p>Hài lòng mới ký nhận và thanh toán</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>⏰ Thời Gian Giao Hàng</h2>
                        <div className="time-table">
                            <div className="time-row">
                                <span className="time-label">Nội thành Hà Nội</span>
                                <span className="time-value">2-4 giờ</span>
                            </div>
                            <div className="time-row">
                                <span className="time-label">Hà Nội mở rộng</span>
                                <span className="time-value">4-8 giờ</span>
                            </div>
                            <div className="time-row">
                                <span className="time-label">Miền Bắc</span>
                                <span className="time-value">1-2 ngày</span>
                            </div>
                            <div className="time-row">
                                <span className="time-label">Miền Trung</span>
                                <span className="time-value">2-3 ngày</span>
                            </div>
                            <div className="time-row">
                                <span className="time-label">Miền Nam</span>
                                <span className="time-value">2-3 ngày</span>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="policy-cta">
                    <h2>Cần hỗ trợ giao hàng?</h2>
                    <p>Liên hệ để biết chính xác thời gian giao hàng</p>
                    <a href="tel:0846865650" className="cta-btn-primary">
                        📞 Hotline: 084.686.5650
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicyPage;
