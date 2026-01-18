import React from 'react';
import '../styles/PolicyPage.css';

const ReturnPolicyPage = () => {
    return (
        <div className="policy-page">
            <div className="policy-container">
                <div className="policy-hero return">
                    <h1>↩️ Chính Sách Đổi Trả</h1>
                    <p>Đổi trả dễ dàng - Không phí - Không rắc rối</p>
                </div>

                <div className="policy-content">
                    <section className="policy-section">
                        <h2>📋 Điều Kiện Đổi Trả</h2>
                        <div className="info-box">
                            <ul>
                                <li>Trong vòng <strong>15 ngày</strong> kể từ ngày nhận hàng</li>
                                <li>Sản phẩm còn nguyên vẹn, chưa qua sử dụng</li>
                                <li>Đầy đủ hộp, phụ kiện, tem niêm phong</li>
                                <li>Có hóa đơn mua hàng</li>
                                <li>Lỗi do nhà sản xuất hoặc giao nhầm</li>
                            </ul>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>🔄 Các Trường Hợp Đổi Trả</h2>
                        <div className="return-cases">
                            <div className="case-card success">
                                <h4>✅ Được đổi trả miễn phí</h4>
                                <ul>
                                    <li>Lỗi do nhà sản xuất</li>
                                    <li>Giao nhầm sản phẩm</li>
                                    <li>Thiếu phụ kiện</li>
                                    <li>Không đúng mô tả</li>
                                </ul>
                            </div>
                            <div className="case-card warning">
                                <h4>⚠️ Phí đổi hàng 10%</h4>
                                <ul>
                                    <li>Đổi ý không muốn mua</li>
                                    <li>Chọn nhầm cấu hình</li>
                                    <li>Không hợp phong thủy</li>
                                    <li>Tìm được giá rẻ hơn</li>
                                </ul>
                            </div>
                            <div className="case-card danger">
                                <h4>❌ Không áp dụng đổi trả</h4>
                                <ul>
                                    <li>Quá 15 ngày</li>
                                    <li>Đã qua sử dụng</li>
                                    <li>Thiếu phụ kiện, hộp</li>
                                    <li>Tem bảo hành bị rách</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>🔧 Quy Trình Đổi Trả</h2>
                        <div className="process-steps">
                            <div className="process-step">
                                <span className="step-number">1</span>
                                <h4>Liên hệ</h4>
                                <p>Gọi <strong>084.686.5650</strong> hoặc chat online</p>
                            </div>
                            <div className="process-step">
                                <span className="step-number">2</span>
                                <h4>Xác nhận</h4>
                                <p>Cung cấp thông tin đơn hàng và lý do đổi trả</p>
                            </div>
                            <div className="process-step">
                                <span className="step-number">3</span>
                                <h4>Gửi hàng</h4>
                                <p>Đóng gói cẩn thận và gửi về (hoặc ship đến lấy)</p>
                            </div>
                            <div className="process-step">
                                <span className="step-number">4</span>
                                <h4>Hoàn tiền/Đổi máy</h4>
                                <p>Nhận tiền trong 3-5 ngày hoặc đổi máy mới</p>
                            </div>
                        </div>
                    </section>

                    <section className="policy-section">
                        <h2>💰 Chính Sách Hoàn Tiền</h2>
                        <div className="refund-info">
                            <div className="refund-method">
                                <h4>Thanh toán online</h4>
                                <p>Hoàn về tài khoản trong <strong>3-5 ngày làm việc</strong></p>
                            </div>
                            <div className="refund-method">
                                <h4>Thanh toán COD</h4>
                                <p>Chuyển khoản trong <strong>1-2 ngày làm việc</strong></p>
                            </div>
                        </div>
                    </section>
                </div>

                <div className="policy-cta">
                    <h2>Cần hỗ trợ đổi trả?</h2>
                    <p>Liên hệ ngay để được xử lý nhanh chóng</p>
                    <a href="tel:0846865650" className="cta-btn-primary">
                        📞 Hotline: 084.686.5650
                    </a>
                </div>
            </div>
        </div>
    );
};

export default ReturnPolicyPage;
