import React from 'react';
import { Link } from 'react-router-dom';
import './AboutPage.css';

const AboutPage = () => {
    return (
        <div className="about-page">
            {/* Hero Section */}
            <div className="about-hero">
                <div className="about-hero-content">
                    <h1 className="about-title">🌐 About Us</h1>
                    <p className="about-subtitle">
                        Vietnam's Leading Trusted Laptop Retail System
                    </p>
                </div>
            </div>

            {/* Company Story */}
            <div className="company-story">
                <div className="story-container">
                    <div className="story-content">
                        <h2>📖 Our Story</h2>
                        <p>
                            <strong>Laptop Store</strong> was founded in 2015 with a mission to bring 
                            Vietnamese customers genuine, high-quality laptop products at the most reasonable prices.
                        </p>
                        <p>
                            Over 10 years of development, we have become one of the leading 
                            laptop distributors in Vietnam with more than <strong>50 stores</strong> nationwide 
                            and over <strong>500,000 trusted customers</strong>.
                        </p>
                    </div>
                    <div className="story-image">
                        <img src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600" alt="Our Team" />
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div className="mission-vision">
                <div className="mv-container">
                    <div className="mv-item mission">
                        <div className="mv-icon">🎯</div>
                        <h3>Mission</h3>
                        <p>
                            Provide high-quality technology products and dedicated service, 
                            helping customers improve work productivity and quality of life.
                        </p>
                    </div>
                    <div className="mv-item vision">
                        <div className="mv-icon">🚀</div>
                        <h3>Vision</h3>
                        <p>
                            Become Vietnam's #1 laptop retail system, trusted 
                            and chosen by customers as their top choice for technology shopping.
                        </p>
                    </div>
                    <div className="mv-item values">
                        <div className="mv-icon">💎</div>
                        <h3>Core Values</h3>
                        <p>
                            Integrity - Professionalism - Quality - Commitment. 
                            Always putting customer interests first.
                        </p>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="core-values">
                <div className="values-container">
                    <h2>⭐ Core Values</h2>
                    <div className="values-grid">
                        <div className="value-item">
                            <span className="value-icon">✓</span>
                            <h4>100% Genuine</h4>
                            <p>All products are genuine with full VAT</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">🛡️</span>
                            <h4>Trusted Warranty</h4>
                            <p>Official warranty at authorized service centers</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">💰</span>
                            <h4>Best Price</h4>
                            <p>Competitive pricing, refund if found cheaper elsewhere</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">🚚</span>
                            <h4>Fast Delivery</h4>
                            <p>Delivery in 2-4 hours in city, 1-3 days nationwide</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">👨‍💼</span>
                            <h4>Professional Consultation</h4>
                            <p>Knowledgeable team with enthusiastic advice</p>
                        </div>
                        <div className="value-item">
                            <span className="value-icon">🔄</span>
                            <h4>Flexible Returns</h4>
                            <p>15-day return for manufacturer defects</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="stats-section">
                <div className="stats-container">
                    <div className="stat-box">
                        <div className="stat-number">10+</div>
                        <div className="stat-label">Years of Experience</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">50+</div>
                        <div className="stat-label">Stores Nationwide</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">500K+</div>
                        <div className="stat-label">Trusted Customers</div>
                    </div>
                    <div className="stat-box">
                        <div className="stat-number">4.8★</div>
                        <div className="stat-label">Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Team */}
            <div className="team-section">
                <div className="team-container">
                    <h2>👥 Leadership Team</h2>
                    <div className="team-grid">
                        <div className="team-member">
                            <h4>Trịnh Việt Hoàng</h4>
                            <p className="member-title">CEO & Founder</p>
                            <p className="member-desc">15 years of experience in the technology industry</p>
                        </div>
                        <div className="team-member">
                            <h4>Trịnh Việt Hoàng</h4>
                            <p className="member-title">CTO</p>
                            <p className="member-desc">Technology expert with 12 years of experience</p>
                        </div>
                        <div className="team-member">
                            <h4>Trịnh Việt Hoàng</h4>
                            <p className="member-title">COO</p>
                            <p className="member-desc">Operations and logistics expert</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Partners */}
            <div className="partners-section">
                <div className="partners-container">
                    <h2>🤝 Strategic Partners</h2>
                    <p className="partners-subtitle">We are proud to be official partners of leading brands</p>
                    <div className="partners-grid">
                        <div className="partner-logo">Dell</div>
                        <div className="partner-logo">HP</div>
                        <div className="partner-logo">Lenovo</div>
                        <div className="partner-logo">Asus</div>
                        <div className="partner-logo">Acer</div>
                        <div className="partner-logo">MSI</div>
                        <div className="partner-logo">Apple</div>
                        <div className="partner-logo">Microsoft</div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="about-cta">
                <div className="cta-content">
                    <h2>Ready to shop with us?</h2>
                    <p>Discover hundreds of genuine laptop models at the best prices</p>
                    <div className="cta-actions">
                        <Link to="/" className="cta-btn primary">
                            🛍️ View Products
                        </Link>
                        <Link to="/contact" className="cta-btn secondary">
                            📧 Contact Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
