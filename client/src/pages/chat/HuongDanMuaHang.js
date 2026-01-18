import React from 'react';
import { motion } from 'framer-motion';
import { FiPackage } from 'react-icons/fi';
import '../notification/PolicyPages.css';

const HuongDanMuaHang = () => {
    return (
        <div className="policy-page">
            <motion.div 
                className="policy-hero"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <FiPackage className="hero-icon" />
                <h1>Hướng Dẫn Mua Hàng</h1>
                <p>Quy trình mua hàng đơn giản, nhanh chóng</p>
            </motion.div>

            <div className="policy-content">
                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <h2>📱 Bước 1: Chọn sản phẩm</h2>
                    <ul>
                        <li>Truy cập website của chúng tôi</li>
                        <li>Tìm kiếm sản phẩm bằng thanh search hoặc lọc theo danh mục</li>
                        <li>Xem chi tiết thông số kỹ thuật</li>
                        <li>Click "Thêm vào giỏ hàng"</li>
                    </ul>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <h2>🛒 Bước 2: Kiểm tra giỏ hàng</h2>
                    <ul>
                        <li>Click vào icon giỏ hàng ở góc phải</li>
                        <li>Kiểm tra lại sản phẩm và số lượng</li>
                        <li>Áp dụng mã giảm giá nếu có</li>
                        <li>Click "Thanh toán"</li>
                    </ul>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    <h2>📝 Bước 3: Điền thông tin</h2>
                    <ul>
                        <li>Nhập họ tên, số điện thoại</li>
                        <li>Nhập địa chỉ giao hàng chi tiết</li>
                        <li>Chọn phương thức thanh toán</li>
                        <li>Kiểm tra lại thông tin</li>
                    </ul>
                </motion.section>

                <motion.section
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <h2>✅ Bước 4: Xác nhận đơn hàng</h2>
                    <ul>
                        <li>Click "Đặt hàng" để hoàn tất</li>
                        <li>Nhận mã đơn hàng qua SMS/Email</li>
                        <li>Chờ nhân viên liên hệ xác nhận</li>
                        <li>Theo dõi đơn hàng trong mục "Đơn hàng của tôi"</li>
                    </ul>
                </motion.section>

                <div className="contact-support">
                    <h3>💬 Cần hỗ trợ?</h3>
                    <p>Liên hệ hotline: <strong>084.686.5650</strong></p>
                </div>
            </div>
        </div>
    );
};

export default HuongDanMuaHang;
