import React from 'react';
import FAQ from '../../components/common/FAQ';
import './FAQPage.css';

const FAQPage = () => {
    const allFAQs = [
        {
            question: '⏰ Thời gian giao hàng là bao lâu?',
            answer: 'Giao hàng nhanh trong 2-4 giờ (nội thành Hà Nội) hoặc 1-3 ngày (các tỉnh khác). Miễn phí ship cho đơn hàng trên 5 triệu đồng.'
        },
        {
            question: '↩️ Chính sách đổi trả như thế nào?',
            answer: 'Đổi trả miễn phí trong 15 ngày đối với lỗi từ nhà sản xuất. Sản phẩm phải còn nguyên vẹn, đầy đủ hộp và phụ kiện.'
        },
        {
            question: '🛡️ Bảo hành được thực hiện như thế nào?',
            answer: 'Bảo hành chính hãng 12-36 tháng tùy sản phẩm. Hỗ trợ bảo hành tại hãng hoặc tại cửa hàng của chúng tôi.'
        },
        {
            question: '💳 Có hỗ trợ trả góp 0% không?',
            answer: 'Có, chúng tôi hỗ trợ trả góp 0% lãi suất qua thẻ tín dụng cho đơn hàng từ 3 triệu, kỳ hạn từ 3-12 tháng.'
        },
        {
            question: '📦 Tôi có thể kiểm tra hàng trước khi nhận không?',
            answer: 'Có, bạn được quyền đồng kiểm tra, test máy khi nhận hàng và có thể từ chối nếu không hài lòng.'
        },
        {
            question: '🎁 Làm thế nào để nhận được khuyến mãi?',
            answer: 'Theo dõi mục "Khuyến mãi Hot" trên website hoặc fanpage Facebook của chúng tôi để nhận thông tin ưu đãi mới nhất.'
        },
        {
            question: '📞 Tôi có thể liên hệ hỗ trợ qua đâu?',
            answer: 'Liên hệ hỗ trợ 24/7 qua Hotline 084.686.5650, Email, hoặc Live Chat trực tiếp trên website.'
        },
        {
            question: '🔒 Thông tin cá nhân của tôi có được bảo mật không?',
            answer: 'Chúng tôi cam kết bảo mật 100% thông tin cá nhân của bạn bằng mã hóa SSL 256-bit. Dữ liệu chỉ được sử dụng cho mục đích giao hàng và hỗ trợ khách hàng.'
        },
        {
            question: '💰 Tôi có thể thanh toán bằng cách nào?',
            answer: 'Hỗ trợ đa dạng phương thức: Thẻ tín dụng (Visa/Mastercard), ATM nội địa, ví điện tử (ZaloPay, MoMo), và thanh toán khi nhận hàng (COD).'
        },
        {
            question: '🚚 Phí vận chuyển là bao nhiêu?',
            answer: 'Miễn phí vận chuyển cho đơn hàng từ 5 triệu. Dưới 5 triệu: 30,000₫ (nội thành), 50,000₫ (ngoại thành và tỉnh).'
        },
        {
            question: '📝 Làm sao để theo dõi đơn hàng?',
            answer: 'Đăng nhập tài khoản và vào mục "Đơn hàng của tôi" để xem chi tiết trạng thái đơn hàng. Bạn cũng sẽ nhận được email/SMS thông báo.'
        },
        {
            question: '🎯 Laptop nào phù hợp cho sinh viên?',
            answer: 'Laptop văn phòng với RAM 8GB, SSD 256GB, màn hình 14-15 inch là lựa chọn tốt. Tầm giá 10-15 triệu phù hợp cho học tập và giải trí.'
        },
        {
            question: '🎮 Cấu hình nào tốt cho chơi game?',
            answer: 'Nên chọn laptop gaming với CPU Intel Core i5/i7 hoặc AMD Ryzen 5/7, RAM 16GB, card đồ họa rời GTX/RTX series, màn hình 120Hz trở lên.'
        },
        {
            question: '🖥️ Có hỗ trợ nâng cấp RAM và ổ cứng không?',
            answer: 'Có, chúng tôi hỗ trợ nâng cấp RAM và ổ cứng với giá ưu đãi. Bảo hành vẫn được giữ nguyên nếu nâng cấp tại cửa hàng.'
        },
        {
            question: '📄 Tôi có nhận được hóa đơn VAT không?',
            answer: 'Có, bạn tick chọn "Xuất hóa đơn VAT" khi đặt hàng và điền đầy đủ thông tin công ty để nhận hóa đơn đỏ.'
        },
        {
            question: '🔄 Có thể đổi sản phẩm khác không?',
            answer: 'Có, trong vòng 15 ngày bạn có thể đổi sang sản phẩm khác cùng giá hoặc bù thêm tiền nếu sản phẩm mới đắt hơn.'
        }
    ];

    return (
        <div className="faq-page">
            <div className="faq-page-container">
                <div className="faq-page-hero">
                    <h1>❓ Câu Hỏi Thường Gặp</h1>
                    <p>Tất cả thông tin bạn cần biết về dịch vụ của chúng tôi</p>
                </div>

                <FAQ faqs={allFAQs} initialShowCount={6} />

                <div className="faq-contact-box">
                    <h2>Không tìm thấy câu trả lời?</h2>
                    <p>Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp đỡ bạn</p>
                    <div className="contact-options">
                        <a href="tel:0846865650" className="contact-option">
                            <span className="contact-icon">📞</span>
                            <div>
                                <h4>Hotline</h4>
                                <p>084.686.5650</p>
                            </div>
                        </a>
                        <a href="mailto:support@laptopstore.com" className="contact-option">
                            <span className="contact-icon">📧</span>
                            <div>
                                <h4>Email</h4>
                                <p>support@laptopstore.com</p>
                            </div>
                        </a>
                        <a href="/contact" className="contact-option">
                            <span className="contact-icon">💬</span>
                            <div>
                                <h4>Live Chat</h4>
                                <p>Chat trực tiếp</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQPage;
