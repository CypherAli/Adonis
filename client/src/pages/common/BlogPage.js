import React from 'react';
import { Link } from 'react-router-dom';
import './BlogPage.css';

const BlogPage = () => {
    const blogPosts = [
        {
            id: 1,
            title: "Top 10 Laptop Tốt Nhất Năm 2025",
            excerpt: "Tổng hợp những mẫu laptop được đánh giá cao nhất trong năm với hiệu năng vượt trội và giá cả hợp lý...",
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600",
            author: "Tech Expert",
            date: "9 Tháng 11, 2025",
            category: "Review",
            readTime: "5 phút đọc"
        },
        {
            id: 2,
            title: "Hướng Dẫn Chọn Laptop Gaming Phù Hợp",
            excerpt: "Những tiêu chí quan trọng khi lựa chọn laptop gaming: GPU, CPU, RAM, màn hình... để có trải nghiệm chơi game tốt nhất...",
            image: "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600",
            author: "Gaming Pro",
            date: "8 Tháng 11, 2025",
            category: "Hướng dẫn",
            readTime: "8 phút đọc"
        },
        {
            id: 3,
            title: "So Sánh: MacBook Air M2 vs MacBook Pro M2",
            excerpt: "Phân tích chi tiết sự khác biệt giữa hai dòng MacBook mới nhất của Apple, giúp bạn đưa ra quyết định đúng đắn...",
            image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600",
            author: "Apple Insider",
            date: "7 Tháng 11, 2025",
            category: "So sánh",
            readTime: "10 phút đọc"
        },
        {
            id: 4,
            title: "5 Mẹo Tăng Tuổi Thọ Pin Laptop",
            excerpt: "Cách bảo quản và sử dụng laptop đúng cách để pin luôn hoạt động ở trạng thái tốt nhất trong thời gian dài...",
            image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600",
            author: "Tech Tips",
            date: "6 Tháng 11, 2025",
            category: "Tips & Tricks",
            readTime: "4 phút đọc"
        },
        {
            id: 5,
            title: "Xu Hướng Laptop 2025: AI và Hiệu Năng",
            excerpt: "Khám phá những xu hướng công nghệ laptop mới nhất với tích hợp AI, NPU, và hiệu năng vượt trội...",
            image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=600",
            author: "Future Tech",
            date: "5 Tháng 11, 2025",
            category: "Tin tức",
            readTime: "7 phút đọc"
        },
        {
            id: 6,
            title: "Laptop Cho Sinh Viên: Lựa Chọn Thông Minh",
            excerpt: "Gợi ý các dòng laptop phù hợp với sinh viên về cả tính năng và giá cả, đáp ứng nhu cầu học tập và giải trí...",
            image: "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=600",
            author: "Student Guide",
            date: "4 Tháng 11, 2025",
            category: "Hướng dẫn",
            readTime: "6 phút đọc"
        }
    ];

    const categories = ["Tất cả", "Review", "Hướng dẫn", "So sánh", "Tin tức", "Tips & Tricks"];

    return (
        <div className="blog-page">
            {/* Hero Section */}
            <div className="blog-hero">
                <div className="blog-hero-content">
                    <h1 className="blog-title">📰 Tin Tức & Đánh Giá</h1>
                    <p className="blog-subtitle">
                        Tin tức công nghệ mới nhất, đánh giá chi tiết và hướng dẫn sử dụng
                    </p>
                </div>
            </div>

            {/* Featured Post */}
            <div className="featured-section">
                <div className="featured-container">
                    <div className="featured-badge">✨ Nổi bật</div>
                    <div className="featured-post">
                        <div className="featured-image">
                            <img src={blogPosts[0].image} alt={blogPosts[0].title} />
                        </div>
                        <div className="featured-content">
                            <span className="featured-category">{blogPosts[0].category}</span>
                            <h2 className="featured-title">{blogPosts[0].title}</h2>
                            <p className="featured-excerpt">{blogPosts[0].excerpt}</p>
                            <div className="featured-meta">
                                <span className="meta-item">👤 {blogPosts[0].author}</span>
                                <span className="meta-item">📅 {blogPosts[0].date}</span>
                                <span className="meta-item">⏱️ {blogPosts[0].readTime}</span>
                            </div>
                            <button 
                                className="read-more-btn"
                                onClick={() => window.location.href = `/blog/${blogPosts[0].id}`}
                                style={{cursor: 'pointer'}}
                            >
                                Đọc thêm →
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Filter */}
            <div className="categories-section">
                <div className="categories-container">
                    <h3 className="categories-title">Danh mục</h3>
                    <div className="categories-list">
                        {categories.map((category, index) => (
                            <button 
                                key={index} 
                                className={`category-btn ${index === 0 ? 'active' : ''}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Blog Posts Grid */}
            <div className="blog-content">
                <div className="blog-container">
                    <div className="posts-grid">
                        {blogPosts.slice(1).map(post => (
                            <article key={post.id} className="blog-card">
                                <div className="blog-card-image">
                                    <img src={post.image} alt={post.title} />
                                    <span className="blog-card-category">{post.category}</span>
                                </div>
                                <div className="blog-card-content">
                                    <h3 className="blog-card-title">{post.title}</h3>
                                    <p className="blog-card-excerpt">{post.excerpt}</p>
                                    <div className="blog-card-meta">
                                        <div className="meta-info">
                                            <span className="meta-item">👤 {post.author}</span>
                                            <span className="meta-item">📅 {post.date}</span>
                                        </div>
                                        <span className="read-time">{post.readTime}</span>
                                    </div>
                                    <button 
                                        className="blog-card-btn"
                                        onClick={() => window.location.href = `/blog/${post.id}`}
                                        style={{cursor: 'pointer'}}
                                    >
                                        Đọc ngay →
                                    </button>
                                </div>
                            </article>
                        ))}
                    </div>

                    {/* Sidebar */}
                    <aside className="blog-sidebar">
                        {/* Newsletter */}
                        <div className="sidebar-widget newsletter-widget">
                            <h4 className="widget-title">📬 Subscribe to newsletter</h4>
                            <p className="widget-text">Get notifications about latest articles</p>
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
                        </div>

                        {/* Popular Posts */}
                        <div className="sidebar-widget popular-widget">
                            <h4 className="widget-title">🔥 Bài viết hot</h4>
                            <div className="popular-posts">
                                {blogPosts.slice(0, 4).map(post => (
                                    <div key={post.id} className="popular-post-item">
                                        <img src={post.image} alt={post.title} />
                                        <div className="popular-post-info">
                                            <h5>{post.title}</h5>
                                            <span className="popular-post-date">{post.date}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tags */}
                        <div className="sidebar-widget tags-widget">
                            <h4 className="widget-title">🏷️ Tags phổ biến</h4>
                            <div className="tags-list">
                                <span className="tag">Laptop Gaming</span>
                                <span className="tag">MacBook</span>
                                <span className="tag">Windows 11</span>
                                <span className="tag">Dell XPS</span>
                                <span className="tag">Asus ROG</span>
                                <span className="tag">HP Pavilion</span>
                                <span className="tag">Lenovo ThinkPad</span>
                                <span className="tag">MSI</span>
                            </div>
                        </div>
                    </aside>
                </div>
            </div>

            {/* CTA Section */}
            <div className="blog-cta">
                <div className="cta-content">
                    <h2>Bạn cần tư vấn chọn laptop?</h2>
                    <p>Đội ngũ chuyên gia của chúng tôi sẵn sàng hỗ trợ bạn 24/7</p>
                    <div className="cta-actions">
                        <Link to="/" className="cta-btn primary">
                            🛍️ Xem sản phẩm
                        </Link>
                        <a href="tel:0848565650" className="cta-btn secondary">
                            📞 Gọi ngay: 084.856.5650
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BlogPage;
