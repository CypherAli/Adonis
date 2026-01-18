import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiClock, FiUser, FiTag, FiTrendingUp, FiArrowLeft, FiShare2, FiHeart, FiMessageCircle } from 'react-icons/fi';
import './BlogDetailPage.css';

const BlogDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [isLiked, setIsLiked] = useState(false);

    // Combined articles data from both NewsPage and BlogPage
    const allArticles = [
        // From NewsPage
        {
            id: 1,
            title: 'Ra mắt Dell XPS 15 2025 - Hiệu năng vượt trội với Intel Core Ultra',
            excerpt: 'Dell vừa chính thức giới thiệu dòng laptop XPS 15 thế hệ mới với chip Intel Core Ultra mạnh mẽ, màn hình OLED 4K tuyệt đẹp...',
            category: 'Sản phẩm mới',
            author: 'Nguyễn Văn A',
            date: '2025-11-10',
            image: '💻',
            tags: ['Dell', 'XPS', 'Intel', 'Flagship'],
            views: 1250,
            readTime: '8 phút đọc',
            content: `
                <h2>Giới thiệu Dell XPS 15 2025</h2>
                <p>Dell vừa chính thức ra mắt dòng laptop XPS 15 thế hệ mới với những cải tiến đáng kể về hiệu năng và thiết kế. Đây được xem là một trong những dòng laptop cao cấp đáng chú ý nhất trong năm 2025.</p>

                <h3>Hiệu năng vượt trội với Intel Core Ultra</h3>
                <p>Dell XPS 15 2025 được trang bị chip Intel Core Ultra thế hệ mới nhất, mang đến hiệu năng xử lý mạnh mẽ hơn tới 40% so với thế hệ trước. Chip này tích hợp NPU (Neural Processing Unit) giúp tăng tốc các tác vụ AI và machine learning.</p>

                <ul>
                    <li>CPU Intel Core Ultra 7/9 thế hệ mới</li>
                    <li>GPU NVIDIA RTX 4060/4070 Ti</li>
                    <li>RAM DDR5 32GB/64GB</li>
                    <li>SSD PCIe Gen 5 lên đến 2TB</li>
                </ul>

                <h3>Màn hình OLED 4K tuyệt đẹp</h3>
                <p>Màn hình OLED 4K 15.6 inch của XPS 15 mang đến chất lượng hiển thị đỉnh cao với độ tương phản vô cực, màu sắc rực rỡ và độ đen sâu thẳm. Hỗ trợ 100% DCI-P3 và HDR400, màn hình này lý tưởng cho cả công việc sáng tạo và giải trí.</p>

                <h3>Thiết kế tinh tế, bền bỉ</h3>
                <p>Dell XPS 15 2025 vẫn giữ nguyên ngôn ngữ thiết kế đặc trưng với khung máy bằng nhôm nguyên khối, viền màn hình siêu mỏng InfinityEdge. Trọng lượng chỉ 1.8kg, độ dày 18mm - rất ấn tượng cho một laptop 15 inch cao cấp.</p>

                <h3>Pin và kết nối</h3>
                <p>Pin 86Wh hỗ trợ sử dụng liên tục lên đến 12 giờ. Máy trang bị đầy đủ cổng kết nối:</p>
                <ul>
                    <li>2 x Thunderbolt 4</li>
                    <li>1 x USB-C 3.2</li>
                    <li>1 x SD Card Reader</li>
                    <li>1 x Audio Jack 3.5mm</li>
                    <li>WiFi 7 và Bluetooth 5.4</li>
                </ul>

                <h3>Giá bán và kết luận</h3>
                <p>Dell XPS 15 2025 có giá khởi điểm từ 45,990,000 VNĐ cho phiên bản cơ bản. Với những cải tiến đáng kể về hiệu năng, màn hình và thiết kế, XPS 15 2025 xứng đáng là một trong những lựa chọn hàng đầu cho người dùng chuyên nghiệp và những ai yêu thích công nghệ cao cấp.</p>
            `
        },
        {
            id: 2,
            title: 'Black Friday 2025: Giảm đến 50% cho hàng ngàn sản phẩm laptop',
            excerpt: 'Chương trình Black Friday lớn nhất năm với ưu đãi cực sốc, giảm giá sập sàn cho hơn 5000 sản phẩm laptop...',
            category: 'Khuyến mãi',
            author: 'Trần Thị B',
            date: '2025-11-08',
            image: '🎁',
            tags: ['Sale', 'Black Friday', 'Khuyến mãi'],
            views: 3420,
            readTime: '5 phút đọc',
            content: `
                <h2>Black Friday 2025 - Sự kiện mua sắm lớn nhất năm</h2>
                <p>Black Friday 2025 đã chính thức khởi động với hàng ngàn ưu đãi hấp dẫn, giảm giá sâu lên đến 50% cho các dòng laptop cao cấp.</p>

                <h3>Các chương trình ưu đãi nổi bật</h3>
                <ul>
                    <li><strong>Flash Sale 0h-6h:</strong> Giảm 50% cho 100 sản phẩm đầu tiên</li>
                    <li><strong>Giảm 30-40%:</strong> Áp dụng cho hơn 2000 sản phẩm laptop gaming</li>
                    <li><strong>Giảm 25-35%:</strong> Dòng laptop văn phòng, ultrabook</li>
                    <li><strong>Combo ưu đãi:</strong> Mua laptop tặng phụ kiện trị giá 5 triệu</li>
                </ul>

                <h3>Top sản phẩm giảm giá mạnh nhất</h3>
                <p><strong>1. MacBook Pro M3 Pro 14"</strong> - Giảm 12 triệu, còn 45.990.000đ</p>
                <p><strong>2. Asus ROG Zephyrus G16</strong> - Giảm 15 triệu, còn 49.990.000đ</p>
                <p><strong>3. Dell XPS 13 Plus</strong> - Giảm 8 triệu, còn 29.990.000đ</p>
                <p><strong>4. HP Envy x360</strong> - Giảm 6 triệu, còn 21.990.000đ</p>

                <h3>Quà tặng kèm theo</h3>
                <ul>
                    <li>Balo laptop cao cấp trị giá 1.5 triệu</li>
                    <li>Chuột không dây Logitech MX Master 3</li>
                    <li>Thẻ gift card trị giá 500.000đ</li>
                    <li>Bảo hành mở rộng 1 năm miễn phí</li>
                </ul>

                <h3>Thời gian áp dụng</h3>
                <p>Chương trình diễn ra từ 00:00 ngày 25/11 đến 23:59 ngày 30/11/2025. Số lượng có hạn, áp dụng theo thứ tự đặt hàng.</p>

                <p><strong>Lưu ý:</strong> Chương trình không áp dụng đồng thời với các ưu đãi khác. Hãy nhanh tay để không bỏ lỡ cơ hội sở hữu laptop cao cấp với giá tốt nhất năm!</p>
            `
        },
        {
            id: 3,
            title: 'MacBook Pro M4 2025: Đánh giá chi tiết hiệu năng và thiết kế',
            excerpt: 'Cùng khám phá MacBook Pro M4 mới nhất của Apple với chip M4 cực mạnh, màn hình Mini-LED và nhiều nâng cấp đáng chú ý...',
            category: 'Đánh giá',
            author: 'Lê Văn C',
            date: '2025-11-05',
            image: '⭐',
            tags: ['Apple', 'MacBook', 'Review', 'M4'],
            views: 2100,
            readTime: '12 phút đọc',
            content: `
                <h2>MacBook Pro M4 2025 - Bước tiến vượt bậc của Apple</h2>
                <p>Apple đã chính thức ra mắt MacBook Pro M4 2025, đánh dấu một bước tiến quan trọng trong dòng laptop chuyên nghiệp của hãng.</p>

                <h3>Chip M4 - Hiệu năng đột phá</h3>
                <p>Chip M4 được sản xuất trên tiến trình 3nm thế hệ thứ 2, mang đến hiệu năng vượt trội:</p>
                <ul>
                    <li>CPU 12 nhân (8 hiệu năng + 4 tiết kiệm năng lượng)</li>
                    <li>GPU 40 nhân với ray tracing phần cứng</li>
                    <li>Neural Engine 32 nhân, xử lý 38 nghìn tỷ phép tính/giây</li>
                    <li>Bộ nhớ thống nhất lên đến 128GB</li>
                </ul>

                <h3>Màn hình Liquid Retina XDR</h3>
                <p>Màn hình Mini-LED 14.2" hoặc 16.2" với:</p>
                <ul>
                    <li>Độ sáng tối đa 1600 nits (HDR), 1000 nits (SDR)</li>
                    <li>Tỷ lệ tương phản 1,000,000:1</li>
                    <li>ProMotion 120Hz adaptive refresh rate</li>
                    <li>Hỗ trợ P3 wide color và HDR10</li>
                </ul>

                <h3>Thiết kế và kết nối</h3>
                <p>MacBook Pro M4 giữ nguyên thiết kế đẹp mắt với khung nhôm nguyên khối, kết hợp với hệ thống kết nối mạnh mẽ:</p>
                <ul>
                    <li>3 x Thunderbolt 5 (tốc độ 120 Gbps)</li>
                    <li>1 x HDMI 2.1</li>
                    <li>1 x SDXC card slot</li>
                    <li>1 x MagSafe 3</li>
                    <li>WiFi 7 và Bluetooth 5.4</li>
                </ul>

                <h3>Hiệu năng thực tế</h3>
                <p><strong>Render video 4K:</strong> Nhanh hơn 60% so với M3 Pro<br>
                <strong>Export ảnh RAW:</strong> Xử lý 1000 ảnh trong 2 phút<br>
                <strong>Compile code:</strong> Build project lớn nhanh hơn 45%<br>
                <strong>Gaming:</strong> Chạy mượt game AAA ở 60fps, settings Ultra</p>

                <h3>Pin và phần mềm</h3>
                <p>Pin 100Wh cho thời lượng sử dụng lên đến 22 giờ duyệt web. macOS Sequoia được tối ưu hóa hoàn hảo cho chip M4, mang đến trải nghiệm mượt mà.</p>

                <h3>Kết luận</h3>
                <p>MacBook Pro M4 2025 là lựa chọn hoàn hảo cho chuyên gia sáng tạo, developer và những ai cần hiệu năng đỉnh cao. Giá khởi điểm 52.990.000đ cho bản 14" và 69.990.000đ cho bản 16".</p>
            `
        },
        {
            id: 4,
            title: '10 mẹo tối ưu laptop để làm việc hiệu quả hơn',
            excerpt: 'Chia sẻ 10 mẹo hay giúp bạn tối ưu hóa laptop, tăng hiệu suất làm việc và kéo dài tuổi thọ pin...',
            category: 'Mẹo hay',
            author: 'Phạm Thị D',
            date: '2025-11-03',
            image: '💡',
            tags: ['Tips', 'Tutorial', 'Tối ưu'],
            views: 890,
            readTime: '7 phút đọc',
            content: `
                <h2>10 Mẹo Tối Ưu Laptop Để Làm Việc Hiệu Quả Hơn</h2>
                <p>Dưới đây là những mẹo hay giúp bạn tận dụng tối đa hiệu năng laptop và nâng cao năng suất làm việc.</p>

                <h3>1. Tắt các ứng dụng khởi động không cần thiết</h3>
                <p>Nhiều ứng dụng tự động khởi động cùng Windows làm chậm máy. Vào Task Manager > Startup và tắt các app không cần thiết.</p>

                <h3>2. Dọn dẹp ổ cứng định kỳ</h3>
                <p>Sử dụng Disk Cleanup hoặc Storage Sense để xóa file tạm, cache và các file rác. Giữ ít nhất 20% dung lượng ổ C trống.</p>

                <h3>3. Cập nhật driver thường xuyên</h3>
                <p>Driver cũ có thể gây lỗi và giảm hiệu năng. Sử dụng Windows Update hoặc tải driver từ website nhà sản xuất.</p>

                <h3>4. Tối ưu hóa pin</h3>
                <ul>
                    <li>Giảm độ sáng màn hình xuống 70-80%</li>
                    <li>Bật chế độ Battery Saver khi cần</li>
                    <li>Tắt Bluetooth, WiFi khi không dùng</li>
                    <li>Đóng các app chạy ngầm</li>
                </ul>

                <h3>5. Sử dụng SSD thay vì HDD</h3>
                <p>Nâng cấp lên SSD giúp tốc độ boot, mở app và xử lý file nhanh hơn gấp 5-10 lần so với HDD.</p>

                <h3>6. Quản lý RAM hiệu quả</h3>
                <p>Đóng các tab trình duyệt không dùng, hạn chế mở quá nhiều app cùng lúc. Xem xét nâng cấp RAM nếu thường xuyên thiếu.</p>

                <h3>7. Vệ sinh laptop định kỳ</h3>
                <p>Bụi bẩn tích tụ làm tắc quạt tản nhiệt, khiến máy nóng và giảm hiệu năng. Vệ sinh 3-6 tháng/lần.</p>

                <h3>8. Sử dụng đế tản nhiệt</h3>
                <p>Đế tản nhiệt giúp laptop luôn mát, duy trì hiệu năng ổn định khi làm việc lâu dài hoặc chơi game.</p>

                <h3>9. Tắt hiệu ứng hình ảnh không cần thiết</h3>
                <p>Vào Settings > System > About > Advanced system settings > Performance Settings và chọn "Adjust for best performance".</p>

                <h3>10. Backup dữ liệu thường xuyên</h3>
                <p>Sử dụng OneDrive, Google Drive hoặc ổ cứng ngoài để backup. Điều này không chỉ bảo vệ dữ liệu mà còn giúp giải phóng dung lượng.</p>

                <h3>Kết luận</h3>
                <p>Áp dụng những mẹo trên sẽ giúp laptop của bạn chạy mượt mà hơn, tiết kiệm pin và kéo dài tuổi thọ thiết bị. Hãy thực hiện định kỳ để duy trì hiệu năng tốt nhất!</p>
            `
        },
        {
            id: 5,
            title: 'Sự kiện Tech Expo 2025: Laptop Store trưng bày hơn 500 mẫu laptop',
            excerpt: 'Laptop Store tham gia Tech Expo 2025 với không gian triển lãm hoành tráng, giới thiệu hơn 500 mẫu laptop mới nhất...',
            category: 'Sự kiện',
            author: 'Hoàng Văn E',
            date: '2025-11-01',
            image: '🎉',
            tags: ['Event', 'Tech Expo', 'Triển lãm'],
            views: 670,
            readTime: '6 phút đọc',
            content: `
                <h2>Tech Expo 2025 - Sự kiện công nghệ lớn nhất năm</h2>
                <p>Laptop Store tự hào tham gia Tech Expo 2025 với gian hàng hoành tráng, trưng bày hơn 500 mẫu laptop từ các thương hiệu hàng đầu thế giới.</p>

                <h3>Thông tin sự kiện</h3>
                <ul>
                    <li><strong>Thời gian:</strong> 15-17/12/2025</li>
                    <li><strong>Địa điểm:</strong> Trung tâm Hội chợ Triển lãm Sài Gòn (SECC)</li>
                    <li><strong>Diện tích gian hàng:</strong> 500m²</li>
                    <li><strong>Số lượng sản phẩm:</strong> Hơn 500 mẫu laptop</li>
                </ul>

                <h3>Những gì có tại gian hàng Laptop Store</h3>

                <h4>1. Khu trưng bày sản phẩm mới nhất</h4>
                <p>Trải nghiệm hands-on với các dòng laptop flagship mới nhất:</p>
                <ul>
                    <li>MacBook Pro M4 Pro/Max</li>
                    <li>Dell XPS 15/17 2025</li>
                    <li>Asus ROG Zephyrus G16</li>
                    <li>HP Spectre x360 2025</li>
                    <li>Lenovo ThinkPad X1 Carbon Gen 12</li>
                </ul>

                <h4>2. Gaming Zone</h4>
                <p>Khu vực gaming với hơn 50 laptop gaming cao cấp, sẵn sàng cho bạn trải nghiệm:</p>
                <ul>
                    <li>Asus ROG Strix Scar</li>
                    <li>MSI Titan 18 HX</li>
                    <li>Acer Predator Helios</li>
                    <li>Razer Blade 16</li>
                </ul>

                <h4>3. Khu tư vấn chuyên sâu</h4>
                <p>Đội ngũ chuyên gia công nghệ sẵn sàng tư vấn miễn phí, giúp bạn chọn laptop phù hợp với nhu cầu và ngân sách.</p>

                <h4>4. Workshop & Seminars</h4>
                <p>Các buổi hội thảo và workshop miễn phí:</p>
                <ul>
                    <li>"Xu hướng laptop 2025 và AI" - 15/12, 10:00</li>
                    <li>"Tối ưu laptop cho công việc sáng tạo" - 16/12, 14:00</li>
                    <li>"Gaming laptop: Lựa chọn và bảo dưỡng" - 17/12, 11:00</li>
                </ul>

                <h3>Ưu đãi đặc biệt tại sự kiện</h3>
                <ul>
                    <li>Giảm giá 20-40% cho tất cả sản phẩm</li>
                    <li>Flash sale mỗi 2 giờ với giảm giá lên đến 50%</li>
                    <li>Tặng balo laptop cao cấp cho 100 khách hàng đầu tiên mỗi ngày</li>
                    <li>Quà tặng trị giá 5 triệu cho đơn hàng trên 30 triệu</li>
                    <li>Bảo hành mở rộng 2 năm miễn phí</li>
                </ul>

                <h3>Hoạt động giải trí</h3>
                <ul>
                    <li>Game show "Tìm hiểu laptop" với giải thưởng laptop trị giá 30 triệu</li>
                    <li>Cosplay show với chủ đề gaming</li>
                    <li>Lucky draw mỗi ngày - trúng laptop, phụ kiện</li>
                </ul>

                <h3>Cách tham gia</h3>
                <p>Sự kiện hoàn toàn miễn phí. Đăng ký online tại website để nhận vé VIP và ưu tiên tham gia các workshop.</p>

                <p><strong>Hẹn gặp bạn tại Tech Expo 2025!</strong></p>
            `
        },
        {
            id: 6,
            title: 'Lenovo ThinkPad X1 Carbon Gen 12: Laptop doanh nhân hoàn hảo',
            excerpt: 'ThinkPad X1 Carbon thế hệ 12 với thiết kế siêu mỏng nhẹ, bàn phím tuyệt vời và hiệu năng ổn định...',
            category: 'Sản phẩm mới',
            author: 'Nguyễn Văn A',
            date: '2025-10-28',
            image: '💻',
            tags: ['Lenovo', 'ThinkPad', 'Business'],
            views: 1580,
            readTime: '9 phút đọc',
            content: `
                <h2>Lenovo ThinkPad X1 Carbon Gen 12 - Laptop doanh nhân đỉnh cao</h2>
                <p>ThinkPad X1 Carbon Gen 12 tiếp tục khẳng định vị thế là laptop doanh nhân hàng đầu với nhiều cải tiến đáng chú ý.</p>

                <h3>Thiết kế bền bỉ, siêu mỏng nhẹ</h3>
                <p>Lenovo ThinkPad X1 Carbon Gen 12 sở hữu thiết kế đặc trưng của dòng ThinkPad:</p>
                <ul>
                    <li>Khung carbon fiber siêu nhẹ, chỉ 1.12kg</li>
                    <li>Độ dày 14.9mm</li>
                    <li>Đạt chuẩn quân đội MIL-STD-810H</li>
                    <li>Màu đen carbon đặc trưng</li>
                </ul>

                <h3>Hiệu năng mạnh mẽ</h3>
                <p>Trang bị bộ vi xử lý Intel Core Ultra mới nhất:</p>
                <ul>
                    <li>CPU Intel Core Ultra 5/7 (Series 1)</li>
                    <li>RAM LPDDR5X 32GB/64GB</li>
                    <li>SSD PCIe Gen 4 lên đến 2TB</li>
                    <li>Intel Arc Graphics tích hợp</li>
                </ul>

                <h3>Màn hình chất lượng cao</h3>
                <p>Lựa chọn đa dạng về màn hình 14 inch:</p>
                <ul>
                    <li>FHD+ (1920x1200) IPS, 400 nits</li>
                    <li>2.8K (2880x1800) OLED, 400 nits, HDR500</li>
                    <li>Tùy chọn màn hình cảm ứng</li>
                    <li>Độ phủ màu 100% sRGB</li>
                </ul>

                <h3>Bàn phím huyền thoại</h3>
                <p>Bàn phím ThinkPad luôn được đánh giá cao nhất trong phân khúc laptop doanh nhân:</p>
                <ul>
                    <li>Hành trình phím 1.5mm</li>
                    <li>Feedback tuyệt vời, gõ êm</li>
                    <li>TrackPoint đỏ đặc trưng</li>
                    <li>Touchpad lớn, chính xác</li>
                    <li>Đèn nền 2 cấp độ</li>
                </ul>

                <h3>Bảo mật doanh nghiệp</h3>
                <p>ThinkPad X1 Carbon Gen 12 tích hợp nhiều tính năng bảo mật:</p>
                <ul>
                    <li>Vân tay tích hợp nút nguồn</li>
                    <li>Camera IR hỗ trợ Windows Hello</li>
                    <li>ThinkShutter - nắp che webcam vật lý</li>
                    <li>TPM 2.0</li>
                    <li>Tile integration - tìm laptop khi thất lạc</li>
                </ul>

                <h3>Kết nối đầy đủ</h3>
                <ul>
                    <li>2 x Thunderbolt 4</li>
                    <li>2 x USB-A 3.2</li>
                    <li>1 x HDMI 2.1</li>
                    <li>1 x Audio jack</li>
                    <li>WiFi 7 và Bluetooth 5.4</li>
                    <li>Tùy chọn 4G/5G LTE</li>
                </ul>

                <h3>Pin và hiệu suất</h3>
                <p>Pin 57Wh cho thời gian sử dụng lên đến 14 giờ. Hỗ trợ sạc nhanh, đạt 80% trong 60 phút.</p>

                <h3>Giá bán và kết luận</h3>
                <p>Lenovo ThinkPad X1 Carbon Gen 12 có giá từ 42.990.000đ. Đây là lựa chọn hoàn hảo cho doanh nhân, nhân viên văn phòng cần một laptop bền bỉ, mỏng nhẹ và hiệu năng ổn định.</p>
            `
        }
    ];

    const article = allArticles.find(a => a.id === parseInt(id));

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo(0, 0);
    }, [id]);

    if (!article) {
        return (
            <div className="blog-detail-not-found">
                <div className="not-found-content">
                    <h1>404</h1>
                    <p>Không tìm thấy bài viết</p>
                    <Link to="/blog" className="back-link">
                        <FiArrowLeft /> Quay lại trang tin tức
                    </Link>
                </div>
            </div>
        );
    }

    const relatedArticles = allArticles
        .filter(a => a.id !== article.id && (a.category === article.category || a.tags.some(tag => article.tags.includes(tag))))
        .slice(0, 3);

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: article.title,
                text: article.excerpt,
                url: window.location.href
            });
        } else {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(window.location.href);
            alert('Link đã được sao chép!');
        }
    };

    return (
        <div className="blog-detail-page">
            {/* Back Button */}
            <motion.div 
                className="back-navigation"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="container">
                    <button onClick={() => navigate(-1)} className="back-btn">
                        <FiArrowLeft /> Quay lại
                    </button>
                </div>
            </motion.div>

            {/* Article Header */}
            <motion.section 
                className="article-header"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                <div className="container">
                    <div className="article-header-content">
                        <span className="article-category-badge">{article.category}</span>
                        
                        <motion.h1
                            className="article-title"
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                        >
                            {article.title}
                        </motion.h1>

                        <motion.div 
                            className="article-meta"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="meta-left">
                                <span className="meta-item">
                                    <FiUser /> {article.author}
                                </span>
                                <span className="meta-item">
                                    <FiClock /> {new Date(article.date).toLocaleDateString('vi-VN', { 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </span>
                                <span className="meta-item">
                                    <FiTrendingUp /> {article.views} lượt xem
                                </span>
                                <span className="meta-item">
                                    ⏱️ {article.readTime}
                                </span>
                            </div>

                            <div className="meta-right">
                                <button 
                                    className={`action-btn ${isLiked ? 'liked' : ''}`}
                                    onClick={() => setIsLiked(!isLiked)}
                                >
                                    <FiHeart /> {isLiked ? 'Đã thích' : 'Thích'}
                                </button>
                                <button className="action-btn" onClick={handleShare}>
                                    <FiShare2 /> Chia sẻ
                                </button>
                            </div>
                        </motion.div>

                        <motion.div 
                            className="article-tags"
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                        >
                            {article.tags.map((tag, idx) => (
                                <span key={idx} className="article-tag">
                                    <FiTag /> {tag}
                                </span>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </motion.section>

            {/* Article Content */}
            <section className="article-content-section">
                <div className="container">
                    <div className="article-layout">
                        <motion.article 
                            className="article-main-content"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <div className="article-image-hero">
                                <div className="article-image-placeholder">
                                    {article.image}
                                </div>
                            </div>

                            <div 
                                className="article-body"
                                dangerouslySetInnerHTML={{ __html: article.content }}
                            />

                            {/* Article Footer Actions */}
                            <div className="article-footer-actions">
                                <div className="footer-actions-left">
                                    <button 
                                        className={`footer-action-btn ${isLiked ? 'liked' : ''}`}
                                        onClick={() => setIsLiked(!isLiked)}
                                    >
                                        <FiHeart /> {isLiked ? 'Đã thích' : 'Thích bài viết'}
                                    </button>
                                    <button className="footer-action-btn">
                                        <FiMessageCircle /> Bình luận
                                    </button>
                                </div>
                                <button className="footer-action-btn" onClick={handleShare}>
                                    <FiShare2 /> Chia sẻ
                                </button>
                            </div>
                        </motion.article>

                        {/* Sidebar */}
                        <aside className="article-sidebar">
                            {/* Author Info */}
                            <motion.div 
                                className="sidebar-widget author-widget"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <h4 className="widget-title">Tác giả</h4>
                                <div className="author-info">
                                    <div className="author-avatar">
                                        {article.author.charAt(0)}
                                    </div>
                                    <div className="author-details">
                                        <h5>{article.author}</h5>
                                        <p>Chuyên gia công nghệ</p>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Table of Contents */}
                            <motion.div 
                                className="sidebar-widget toc-widget"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.7 }}
                            >
                                <h4 className="widget-title">📋 Nội dung chính</h4>
                                <div className="toc-list">
                                    <button className="toc-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Giới thiệu</button>
                                    <button className="toc-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Thông số kỹ thuật</button>
                                    <button className="toc-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Hiệu năng</button>
                                    <button className="toc-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Đánh giá</button>
                                    <button className="toc-item" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Kết luận</button>
                                </div>
                            </motion.div>

                            {/* Newsletter */}
                            <motion.div 
                                className="sidebar-widget newsletter-widget"
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.8 }}
                            >
                                <h4 className="widget-title">📬 Đăng ký nhận tin</h4>
                                <p>Nhận thông báo về bài viết mới nhất</p>
                                <form className="newsletter-form">
                                    <input 
                                        type="email" 
                                        placeholder="Email của bạn"
                                        className="newsletter-input"
                                    />
                                    <button type="submit" className="newsletter-btn">
                                        Đăng ký
                                    </button>
                                </form>
                            </motion.div>
                        </aside>
                    </div>
                </div>
            </section>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
                <section className="related-articles-section">
                    <div className="container">
                        <h2 className="section-title">📰 Bài viết liên quan</h2>
                        <div className="related-articles-grid">
                            {relatedArticles.map((relArticle, index) => (
                                <motion.div
                                    key={relArticle.id}
                                    className="related-article-card"
                                    initial={{ opacity: 0, y: 30 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.9 + index * 0.1 }}
                                    whileHover={{ y: -5 }}
                                >
                                    <div className="related-article-image">
                                        <div className="related-image-placeholder">
                                            {relArticle.image}
                                        </div>
                                    </div>
                                    <div className="related-article-content">
                                        <span className="related-category">{relArticle.category}</span>
                                        <h3>{relArticle.title}</h3>
                                        <p>{relArticle.excerpt.substring(0, 100)}...</p>
                                        <Link to={`/blog/${relArticle.id}`} className="related-read-more">
                                            Đọc thêm →
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
};

export default BlogDetailPage;
