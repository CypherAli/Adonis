import React from 'react';
import { motion } from 'framer-motion';
import './TermsPage.css';

const TermsPage = () => {
    const sections = [
        {
            title: '1. Điều khoản chung',
            content: [
                'Bằng việc truy cập và sử dụng website laptopstore.vn, bạn đồng ý tuân thủ các điều khoản và điều kiện sử dụng.',
                'Chúng tôi có quyền thay đổi, chỉnh sửa các điều khoản mà không cần thông báo trước.',
                'Người dùng có trách nhiệm kiểm tra các cập nhật định kỳ.'
            ]
        },
        {
            title: '2. Quyền và trách nhiệm người dùng',
            content: [
                'Người dùng phải cung cấp thông tin chính xác khi đăng ký tài khoản.',
                'Bảo mật thông tin đăng nhập và chịu trách nhiệm về mọi hành động từ tài khoản của mình.',
                'Không sử dụng website cho mục đích vi phạm pháp luật hoặc gây hại cho người khác.',
                'Không sao chép, phân phối nội dung website không có sự cho phép.'
            ]
        },
        {
            title: '3. Quyền và trách nhiệm của Laptop Store',
            content: [
                'Cung cấp thông tin sản phẩm chính xác và cập nhật liên tục.',
                'Bảo mật thông tin khách hàng theo chính sách bảo mật.',
                'Xử lý đơn hàng nhanh chóng và giao hàng đúng hẹn.',
                'Hỗ trợ khách hàng giải đáp thắc mắc và xử lý khiếu nại kịp thời.'
            ]
        },
        {
            title: '4. Chính sách bảo mật thông tin',
            content: [
                'Thông tin cá nhân của khách hàng được bảo mật tuyệt đối.',
                'Không chia sẻ thông tin cho bên thứ ba khi chưa có sự đồng ý.',
                'Sử dụng cookies để cải thiện trải nghiệm người dùng.',
                'Thông tin thanh toán được mã hóa theo tiêu chuẩn quốc tế.'
            ]
        },
        {
            title: '5. Chính sách thanh toán',
            content: [
                'Hỗ trợ nhiều hình thức thanh toán: COD, chuyển khoản, thẻ ATM, ví điện tử.',
                'Giá sản phẩm đã bao gồm VAT.',
                'Có thể phát sinh phí vận chuyển tùy theo khu vực.',
                'Đơn hàng chỉ được xác nhận sau khi thanh toán thành công (đối với thanh toán online).'
            ]
        },
        {
            title: '6. Chính sách đổi trả',
            content: [
                'Đổi trả trong vòng 30 ngày nếu sản phẩm lỗi do nhà sản xuất.',
                'Sản phẩm đổi trả phải còn nguyên vẹn, đầy đủ phụ kiện và hóa đơn.',
                'Chi phí vận chuyển đổi trả do Laptop Store chịu nếu lỗi từ nhà bán.',
                'Không áp dụng đổi trả với sản phẩm đã qua sử dụng hoặc có dấu hiệu tác động vật lý.'
            ]
        },
        {
            title: '7. Giải quyết tranh chấp',
            content: [
                'Mọi tranh chấp sẽ được giải quyết thông qua thương lượng hòa giải.',
                'Nếu không thỏa thuận được, tranh chấp sẽ được đưa ra Tòa án có thẩm quyền.',
                'Khách hàng có thể liên hệ bộ phận chăm sóc khách hàng để được hỗ trợ.',
                'Hotline: 084.686.5650 hoặc email: support@laptopstore.vn'
            ]
        },
        {
            title: '8. Điều khoản sửa đổi',
            content: [
                'Laptop Store có quyền thay đổi điều khoản sử dụng bất cứ lúc nào.',
                'Các thay đổi sẽ có hiệu lực ngay sau khi được đăng tải trên website.',
                'Việc bạn tiếp tục sử dụng dịch vụ sau khi có thay đổi đồng nghĩa với việc chấp nhận.',
                'Ngày cập nhật cuối: 13 tháng 11 năm 2025'
            ]
        }
    ];

    return (
        <div className="terms-page">
            <motion.section 
                className="terms-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="terms-hero-content">
                    <motion.h1
                        initial={{ y: -30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                    >
                        📜 Điều Khoản Sử Dụng
                    </motion.h1>
                    <motion.p
                        initial={{ y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Quy định và chính sách sử dụng website Laptop Store Vietnam
                    </motion.p>
                </div>
            </motion.section>

            <section className="terms-content">
                <div className="container">
                    <motion.div 
                        className="terms-intro"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p>
                            Chào mừng bạn đến với <strong>Laptop Store Vietnam</strong>. 
                            Trước khi sử dụng dịch vụ, vui lòng đọc kỹ các điều khoản dưới đây.
                        </p>
                    </motion.div>

                    <div className="terms-sections">
                        {sections.map((section, index) => (
                            <motion.div
                                key={index}
                                className="terms-section"
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <h2>{section.title}</h2>
                                <ul>
                                    {section.content.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        className="terms-footer"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <p>
                            <strong>Liên hệ hỗ trợ:</strong><br />
                            📞 Hotline: 084.686.5650<br />
                            📧 Email: support@laptopstore.vn<br />
                            📍 Địa chỉ: 123 Đường Láng, Đống Đa, Hà Nội
                        </p>
                        <p className="last-updated">
                            <em>Cập nhật lần cuối: 13/11/2025</em>
                        </p>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default TermsPage;
