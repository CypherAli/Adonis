import React from 'react';
import { FiCheck, FiInfo, FiCreditCard, FiCalendar, FiFileText } from 'react-icons/fi';
import './InstallmentGuidePage.css';

const InstallmentGuidePage = () => {
    return (
        <div className="installment-guide-page">
            <div className="installment-hero">
                <div className="container">
                    <h1>💳 Hướng Dẫn Trả Góp 0%</h1>
                    <p className="hero-subtitle">
                        Sở hữu laptop mơ ước ngay hôm nay với chương trình trả góp 0% lãi suất
                    </p>
                </div>
            </div>

            <div className="container">
                <div className="installment-content">
                    {/* Ưu điểm trả góp */}
                    <section className="installment-section">
                        <div className="section-header">
                            <FiCheck className="section-icon" />
                            <h2>Ưu Điểm Trả Góp 0%</h2>
                        </div>
                        <div className="benefits-grid">
                            <div className="benefit-card">
                                <div className="benefit-icon">🎯</div>
                                <h3>Không lãi suất</h3>
                                <p>0% lãi suất trong toàn bộ thời gian trả góp</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">⚡</div>
                                <h3>Duyệt nhanh</h3>
                                <p>Chỉ 30 phút nhận kết quả phê duyệt</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">📱</div>
                                <h3>Thủ tục đơn giản</h3>
                                <p>Chỉ cần CMND/CCCD và thẻ tín dụng</p>
                            </div>
                            <div className="benefit-card">
                                <div className="benefit-icon">💰</div>
                                <h3>Linh hoạt</h3>
                                <p>Kỳ hạn từ 3-12 tháng tùy chọn</p>
                            </div>
                        </div>
                    </section>

                    {/* Điều kiện trả góp */}
                    <section className="installment-section">
                        <div className="section-header">
                            <FiInfo className="section-icon" />
                            <h2>Điều Kiện Trả Góp</h2>
                        </div>
                        <div className="requirements-box">
                            <div className="requirement-item">
                                <FiCheck className="check-icon" />
                                <div>
                                    <strong>Độ tuổi:</strong> Từ 18 - 60 tuổi
                                </div>
                            </div>
                            <div className="requirement-item">
                                <FiCheck className="check-icon" />
                                <div>
                                    <strong>Giá trị đơn hàng:</strong> Tối thiểu 3.000.000đ
                                </div>
                            </div>
                            <div className="requirement-item">
                                <FiCheck className="check-icon" />
                                <div>
                                    <strong>Giấy tờ:</strong> CMND/CCCD hoặc Hộ chiếu còn hiệu lực
                                </div>
                            </div>
                            <div className="requirement-item">
                                <FiCheck className="check-icon" />
                                <div>
                                    <strong>Thẻ tín dụng:</strong> Visa, MasterCard, JCB (còn hạn sử dụng tối thiểu 3 tháng)
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Các ngân hàng hỗ trợ */}
                    <section className="installment-section">
                        <div className="section-header">
                            <FiCreditCard className="section-icon" />
                            <h2>Ngân Hàng Hỗ Trợ</h2>
                        </div>
                        <div className="banks-grid">
                            {[
                                { name: 'Techcombank', logo: '🏦' },
                                { name: 'VPBank', logo: '🏦' },
                                { name: 'Sacombank', logo: '🏦' },
                                { name: 'MB Bank', logo: '🏦' },
                                { name: 'Vietcombank', logo: '🏦' },
                                { name: 'ACB', logo: '🏦' },
                                { name: 'BIDV', logo: '🏦' },
                                { name: 'VietinBank', logo: '🏦' },
                            ].map((bank, index) => (
                                <div key={index} className="bank-card">
                                    <div className="bank-logo">{bank.logo}</div>
                                    <div className="bank-name">{bank.name}</div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Kỳ hạn và phí */}
                    <section className="installment-section">
                        <div className="section-header">
                            <FiCalendar className="section-icon" />
                            <h2>Kỳ Hạn Trả Góp</h2>
                        </div>
                        <div className="terms-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Kỳ hạn</th>
                                        <th>Giá trị đơn hàng</th>
                                        <th>Lãi suất</th>
                                        <th>Phí chuyển đổi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>3 tháng</td>
                                        <td>Từ 3 triệu</td>
                                        <td className="highlight">0%</td>
                                        <td>0đ</td>
                                    </tr>
                                    <tr>
                                        <td>6 tháng</td>
                                        <td>Từ 5 triệu</td>
                                        <td className="highlight">0%</td>
                                        <td>0đ</td>
                                    </tr>
                                    <tr>
                                        <td>9 tháng</td>
                                        <td>Từ 8 triệu</td>
                                        <td className="highlight">0%</td>
                                        <td>0đ</td>
                                    </tr>
                                    <tr>
                                        <td>12 tháng</td>
                                        <td>Từ 10 triệu</td>
                                        <td className="highlight">0%</td>
                                        <td>0đ</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* Quy trình đăng ký */}
                    <section className="installment-section">
                        <div className="section-header">
                            <FiFileText className="section-icon" />
                            <h2>Quy Trình Đăng Ký</h2>
                        </div>
                        <div className="process-steps">
                            <div className="step-item">
                                <div className="step-number">1</div>
                                <div className="step-content">
                                    <h3>Chọn sản phẩm</h3>
                                    <p>Chọn laptop yêu thích và thêm vào giỏ hàng</p>
                                </div>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step-item">
                                <div className="step-number">2</div>
                                <div className="step-content">
                                    <h3>Chọn trả góp</h3>
                                    <p>Tại trang thanh toán, chọn phương thức "Trả góp 0%"</p>
                                </div>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step-item">
                                <div className="step-number">3</div>
                                <div className="step-content">
                                    <h3>Điền thông tin</h3>
                                    <p>Điền đầy đủ thông tin cá nhân và thẻ tín dụng</p>
                                </div>
                            </div>
                            <div className="step-arrow">→</div>
                            <div className="step-item">
                                <div className="step-number">4</div>
                                <div className="step-content">
                                    <h3>Nhận hàng</h3>
                                    <p>Nhận hàng và thanh toán theo kỳ hạn đã chọn</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Ví dụ tính toán */}
                    <section className="installment-section highlight-section">
                        <div className="section-header">
                            <h2>📊 Ví Dụ Tính Toán</h2>
                        </div>
                        <div className="calculation-example">
                            <div className="example-box">
                                <h4>Laptop Gaming 20.000.000đ - Trả góp 6 tháng</h4>
                                <div className="calculation-details">
                                    <div className="calc-row">
                                        <span>Giá sản phẩm:</span>
                                        <strong>20.000.000đ</strong>
                                    </div>
                                    <div className="calc-row">
                                        <span>Lãi suất:</span>
                                        <strong className="highlight">0%</strong>
                                    </div>
                                    <div className="calc-row">
                                        <span>Kỳ hạn:</span>
                                        <strong>6 tháng</strong>
                                    </div>
                                    <div className="calc-row total">
                                        <span>Trả mỗi tháng:</span>
                                        <strong>3.333.333đ</strong>
                                    </div>
                                    <div className="calc-row total">
                                        <span>Tổng thanh toán:</span>
                                        <strong>20.000.000đ</strong>
                                    </div>
                                </div>
                                <div className="saving-note">
                                    ✅ Tiết kiệm 100% lãi suất - Không phụ thu
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Lưu ý */}
                    <section className="installment-section">
                        <div className="note-box">
                            <h3>📌 Lưu Ý Quan Trọng</h3>
                            <ul className="note-list">
                                <li>Thanh toán đúng hạn để tránh phí phạt từ ngân hàng</li>
                                <li>Kiểm tra hạn mức thẻ tín dụng trước khi đăng ký</li>
                                <li>Giữ nguyên thẻ tín dụng cho đến khi hoàn thành trả góp</li>
                                <li>Liên hệ hotline 084.686.5650 nếu cần hỗ trợ</li>
                                <li>Chương trình có thể thay đổi tùy theo chính sách ngân hàng</li>
                            </ul>
                        </div>
                    </section>

                    {/* Call to Action */}
                    <section className="cta-section">
                        <div className="cta-box">
                            <h2>🎉 Sẵn sàng sở hữu laptop mơ ước?</h2>
                            <p>Liên hệ ngay với chúng tôi để được tư vấn chi tiết về chương trình trả góp 0%</p>
                            <div className="cta-buttons">
                                <a href="tel:0846865650" className="cta-btn primary">
                                    📞 Gọi ngay: 084.686.5650
                                </a>
                                <a href="/lien-he" className="cta-btn secondary">
                                    💬 Chat tư vấn
                                </a>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default InstallmentGuidePage;
