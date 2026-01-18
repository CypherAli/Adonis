import React, { useState, useEffect } from 'react';
import './Testimonials.css';

const Testimonials = () => {
    const [activeIndex, setActiveIndex] = useState(0);

    const testimonials = [
        {
            id: 1,
            name: 'Trịnh Việt Hoàng',
            role: 'Software Engineer',
            rating: 5,
            comment: 'I bought a Dell XPS 15 laptop from the store. Quality product, reasonable price. Staff are enthusiastic and professional. Fast delivery. Very satisfied!',
            product: 'Dell XPS 15',
            date: '2 weeks ago'
        },
        {
            id: 2,
            name: 'Trịnh Việt Hoàng',
            role: 'Graphic Designer',
            rating: 5,
            comment: 'MacBook Pro M2 purchased from here is amazing! Beautiful screen, smooth performance, serves design work very well. Support team is enthusiastic and answers all questions. Will recommend to friends!',
            product: 'MacBook Pro M2',
            date: '3 weeks ago'
        },
        {
            id: 3,
            name: 'Trịnh Việt Hoàng',
            role: 'IT Student',
            rating: 5,
            comment: 'MSI gaming laptop purchased for study and entertainment. Strong configuration, smooth gaming, affordable price for students. Good warranty, immediate support for any issues. Recommend!',
            product: 'MSI Gaming GF63',
            date: '1 month ago'
        },
        {
            id: 4,
            name: 'Trịnh Việt Hoàng',
            role: 'Content Creator',
            rating: 5,
            comment: 'HP Pavilion purchased for content creation, video editing works great. Long battery life, beautiful design, also has promotional price. Staff explained every specification in detail. Wonderful shopping experience!',
            product: 'HP Pavilion 15',
            date: '1 month ago'
        },
        {
            id: 5,
            name: 'Trịnh Việt Hoàng',
            role: 'Entrepreneur',
            rating: 5,
            comment: 'Lenovo ThinkPad used for business work is very durable. Great keyboard, all-day battery life. Reputable store, 100% genuine products. Good after-sales support!',
            product: 'Lenovo ThinkPad X1',
            date: '5 weeks ago'
        },
        {
            id: 6,
            name: 'Trịnh Việt Hoàng',
            role: 'Marketing Manager',
            rating: 5,
            comment: 'Asus ZenBook is thin, light, elegant design, very convenient for work. Stable performance for office work and online meetings. Best market price. Fast delivery, careful packaging!',
            product: 'Asus ZenBook 14',
            date: '6 weeks ago'
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveIndex((prev) => (prev + 1) % testimonials.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [testimonials.length]);

    const handleDotClick = (index) => {
        setActiveIndex(index);
    };

    const handlePrev = () => {
        setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    const handleNext = () => {
        setActiveIndex((prev) => (prev + 1) % testimonials.length);
    };

    return (
        <section className="testimonials-section">
            <div className="testimonials-container">
                <div className="testimonials-header">
                    <h2 className="testimonials-title">
                        <span className="title-icon">💬</span>
                        What Our Customers Say
                        <span className="title-icon">💬</span>
                    </h2>
                    <p className="testimonials-subtitle">
                        Over 10,000+ customers have trusted and chosen us
                    </p>
                    <div className="overall-rating">
                        <div className="rating-stars">⭐⭐⭐⭐⭐</div>
                        <div className="rating-score">4.8/5</div>
                        <div className="rating-count">(2,547 reviews)</div>
                    </div>
                </div>

                <div className="testimonials-carousel">
                    <button className="carousel-btn prev-btn" onClick={handlePrev}>
                        ‹
                    </button>

                    <div className="testimonials-wrapper">
                        {testimonials.map((testimonial, index) => (
                            <div 
                                key={testimonial.id}
                                className={`testimonial-card ${index === activeIndex ? 'active' : ''} ${
                                    index === (activeIndex - 1 + testimonials.length) % testimonials.length ? 'prev' : ''
                                } ${
                                    index === (activeIndex + 1) % testimonials.length ? 'next' : ''
                                }`}
                            >
                                <div className="testimonial-header">
                                    <div className="testimonial-avatar">{testimonial.avatar}</div>
                                    <div className="testimonial-author">
                                        <h4>{testimonial.name}</h4>
                                        <p>{testimonial.role}</p>
                                    </div>
                                    <div className="testimonial-rating">
                                        {'⭐'.repeat(testimonial.rating)}
                                    </div>
                                </div>
                                <div className="testimonial-body">
                                    <p className="testimonial-comment">"{testimonial.comment}"</p>
                                    <div className="testimonial-meta">
                                        <span className="product-bought">📦 {testimonial.product}</span>
                                        <span className="review-date">🕒 {testimonial.date}</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button className="carousel-btn next-btn" onClick={handleNext}>
                        ›
                    </button>
                </div>

                <div className="carousel-dots">
                    {testimonials.map((_, index) => (
                        <button
                            key={index}
                            className={`dot ${index === activeIndex ? 'active' : ''}`}
                            onClick={() => handleDotClick(index)}
                        />
                    ))}
                </div>

                <div className="trust-badges">
                    <div className="trust-badge">
                        <span className="badge-icon">🏆</span>
                        <span className="badge-text">Top #1 Laptop Marketplace</span>
                    </div>
                    <div className="trust-badge">
                        <span className="badge-icon">✅</span>
                        <span className="badge-text">100% Genuine Products</span>
                    </div>
                    <div className="trust-badge">
                        <span className="badge-icon">🚚</span>
                        <span className="badge-text">Free Shipping</span>
                    </div>
                    <div className="trust-badge">
                        <span className="badge-icon">🛡️</span>
                        <span className="badge-text">12-36 Months Warranty</span>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Testimonials;
