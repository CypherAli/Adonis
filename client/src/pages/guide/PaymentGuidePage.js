import React from 'react';
import { FiCreditCard, FiSmartphone, FiDollarSign, FiShield } from 'react-icons/fi';
import './PaymentGuidePage.css';

const PaymentGuidePage = () => {
    return (
        <div className="payment-guide-page">
            <div className="payment-guide-container">
                {/* Hero Section */}
                <div className="payment-hero">
                    <h1>💳 Hướng Dẫn Thanh Toán</h1>
                    <p>Thanh toán an toàn, bảo mật với nhiều phương thức linh hoạt</p>
                </div>

                {/* Payment Methods */}
                <div className="payment-methods">
                    <h2>🎯 Các Phương Thức Thanh Toán</h2>
                    
                    <div className="payment-method-card">
                        <div className="method-icon method-1">
                            <FiCreditCard />
                        </div>
                        <div className="method-content">
                            <h3>Thanh Toán Online (Visa, Mastercard, ATM)</h3>
                            <p className="method-desc">Thanh toán nhanh chóng và an toàn qua cổng thanh toán quốc tế</p>
                            <div className="method-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Bảo mật SSL 256-bit</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Hỗ trợ thẻ Visa, Mastercard, JCB</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Thẻ ATM nội địa (Internet Banking)</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Xác thận OTP an toàn</span>
                                </div>
                            </div>
                            <div className="method-steps">
                                <h4>Các bước thanh toán:</h4>
                                <ol>
                                    <li>Chọn "Thanh toán online" khi đặt hàng</li>
                                    <li>Chọn loại thẻ (Visa/Mastercard/ATM)</li>
                                    <li>Nhập thông tin thẻ và mã OTP</li>
                                    <li>Xác nhận thanh toán</li>
                                    <li>Nhận email xác nhận đơn hàng</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="payment-method-card">
                        <div className="method-icon method-2">
                            <FiSmartphone />
                        </div>
                        <div className="method-content">
                            <h3>Ví Điện Tử (ZaloPay, MoMo)</h3>
                            <p className="method-desc">Thanh toán siêu tiện lợi chỉ với vài thao tác trên điện thoại</p>
                            <div className="method-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Thanh toán trong 30 giây</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Không cần nhập thông tin thẻ</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Được hoàn tiền khi có ưu đãi</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Tích điểm thưởng từ ví</span>
                                </div>
                            </div>
                            <div className="method-steps">
                                <h4>Các bước thanh toán:</h4>
                                <ol>
                                    <li>Chọn "Ví điện tử" (ZaloPay/MoMo)</li>
                                    <li>Quét mã QR hoặc xác nhận trên app</li>
                                    <li>Nhập mã PIN ví điện tử</li>
                                    <li>Hoàn tất thanh toán</li>
                                </ol>
                            </div>
                        </div>
                    </div>

                    <div className="payment-method-card">
                        <div className="method-icon method-3">
                            <FiDollarSign />
                        </div>
                        <div className="method-content">
                            <h3>Thanh Toán Khi Nhận Hàng (COD)</h3>
                            <p className="method-desc">Kiểm tra hàng trước, hài lòng mới thanh toán</p>
                            <div className="method-features">
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>An toàn tuyệt đối</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Được kiểm tra hàng trước</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Không cần thẻ ngân hàng</span>
                                </div>
                                <div className="feature-item">
                                    <span className="feature-icon">✓</span>
                                    <span>Phí ship thấp (miễn phí từ 5tr)</span>
                                </div>
                            </div>
                            <div className="method-steps">
                                <h4>Các bước thanh toán:</h4>
                                <ol>
                                    <li>Chọn "Thanh toán khi nhận hàng"</li>
                                    <li>Đợi nhận hàng (2-4h nội thành, 1-3 ngày tỉnh)</li>
                                    <li>Kiểm tra sản phẩm kỹ càng</li>
                                    <li>Thanh toán tiền mặt cho shipper</li>
                                    <li>Nhận hóa đơn và phiếu bảo hành</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Installment Section */}
                <div className="installment-section">
                    <h2>💰 Trả Góp 0% Lãi Suất</h2>
                    <div className="installment-grid">
                        <div className="installment-card">
                            <h4>Điều kiện trả góp</h4>
                            <ul>
                                <li>Đơn hàng từ <strong>3.000.000₫</strong></li>
                                <li>Có thẻ tín dụng Visa/Mastercard</li>
                                <li>Áp dụng cho hầu hết các ngân hàng</li>
                            </ul>
                        </div>
                        <div className="installment-card">
                            <h4>Kỳ hạn trả góp</h4>
                            <ul>
                                <li>3 tháng - 6 tháng</li>
                                <li>9 tháng - 12 tháng</li>
                                <li>Lãi suất <strong>0%</strong></li>
                            </ul>
                        </div>
                        <div className="installment-card">
                            <h4>Ngân hàng hỗ trợ</h4>
                            <ul>
                                <li>Vietcombank, Techcombank</li>
                                <li>BIDV, VietinBank</li>
                                <li>Sacombank, ACB, TPBank...</li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Security Section */}
                <div className="security-section">
                    <div className="security-icon">
                        <FiShield />
                    </div>
                    <h2>🔒 Bảo Mật Thanh Toán</h2>
                    <p>Chúng tôi cam kết bảo vệ thông tin thanh toán của bạn với công nghệ bảo mật hàng đầu</p>
                    <div className="security-features">
                        <div className="security-item">
                            <span>🔐</span>
                            <p>Mã hóa SSL 256-bit</p>
                        </div>
                        <div className="security-item">
                            <span>✅</span>
                            <p>Xác thực 2 lớp (OTP)</p>
                        </div>
                        <div className="security-item">
                            <span>🛡️</span>
                            <p>Chuẩn PCI DSS</p>
                        </div>
                        <div className="security-item">
                            <span>💯</span>
                            <p>Hoàn tiền 100% nếu có gian lận</p>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="payment-faq">
                    <h2>❓ Câu Hỏi Thường Gặp</h2>
                    <div className="faq-grid">
                        <div className="faq-item-simple">
                            <h4>Tôi có thể thanh toán nhiều lần cho một đơn hàng không?</h4>
                            <p>Hiện tại chúng tôi chưa hỗ trợ tính năng này. Mỗi đơn hàng chỉ thanh toán một lần.</p>
                        </div>
                        <div className="faq-item-simple">
                            <h4>Nếu thanh toán online thất bại thì sao?</h4>
                            <p>Bạn có thể thử lại hoặc chọn phương thức thanh toán khác. Tiền sẽ được hoàn lại trong 3-5 ngày nếu đã trừ.</p>
                        </div>
                        <div className="faq-item-simple">
                            <h4>Có được đổi phương thức thanh toán sau khi đặt không?</h4>
                            <p>Có, liên hệ hotline ngay sau khi đặt hàng để được hỗ trợ thay đổi.</p>
                        </div>
                        <div className="faq-item-simple">
                            <h4>Tôi có nhận được hóa đơn VAT không?</h4>
                            <p>Có, tick chọn "Xuất hóa đơn VAT" khi đặt hàng và cung cấp thông tin công ty.</p>
                        </div>
                    </div>
                </div>

                {/* CTA */}
                <div className="payment-cta">
                    <h2>Cần hỗ trợ thanh toán?</h2>
                    <p>Liên hệ ngay để được tư vấn</p>
                    <a href="tel:0846865650" className="cta-btn-primary">
                        📞 Hotline: 084.686.5650
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PaymentGuidePage;
