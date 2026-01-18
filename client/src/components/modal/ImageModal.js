import React, { useState, useEffect, useCallback } from 'react';
import { FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './ImageModal.css';

const ImageModal = ({ isOpen, onClose, images, initialIndex = 0, product }) => {
    const [currentIndex, setCurrentIndex] = useState(initialIndex);

    useEffect(() => {
        setCurrentIndex(initialIndex);
    }, [initialIndex, isOpen]);

    const handlePrevious = useCallback(() => {
        if (!images) return;
        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
    }, [images]);

    const handleNext = useCallback(() => {
        if (!images) return;
        setCurrentIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
    }, [images]);

    useEffect(() => {
        if (!isOpen) return;

        const handleKeyPress = (e) => {
            if (e.key === 'Escape') onClose();
            else if (e.key === 'ArrowLeft') handlePrevious();
            else if (e.key === 'ArrowRight') handleNext();
        };

        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [isOpen, onClose, handlePrevious, handleNext]);

    if (!isOpen || !images || images.length === 0) return null;

    return (
        <div className="image-modal-overlay" onClick={onClose}>
            <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="image-modal-close" onClick={onClose}>
                    <FiX />
                </button>

                {/* Header with Purple Gradient */}
                <div className="image-modal-header">
                    <h3>{product?.name || 'Xem ảnh sản phẩm'}</h3>
                </div>

                {/* Body - 2 Columns Layout */}
                <div className="image-modal-body">
                    {/* LEFT COLUMN - Images (60%) */}
                    <div className="image-modal-left">
                        {/* Main Image */}
                        <div className="image-modal-main-image">
                            <img 
                                src={images[currentIndex]} 
                                alt={`${product?.name || 'Product'} - ${currentIndex + 1}`}
                            />
                            
                            {/* Navigation Buttons */}
                            {images.length > 1 && (
                                <>
                                    <button className="image-nav-btn prev" onClick={handlePrevious}>
                                        <FiChevronLeft />
                                    </button>
                                    <button className="image-nav-btn next" onClick={handleNext}>
                                        <FiChevronRight />
                                    </button>
                                </>
                            )}

                            {/* Image Counter */}
                            <div className="image-counter">
                                {currentIndex + 1} / {images.length}
                            </div>
                        </div>

                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="image-modal-thumbnails">
                                {images.map((img, index) => (
                                    <div
                                        key={index}
                                        className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                                        onClick={() => setCurrentIndex(index)}
                                    >
                                        <img src={img} alt={`Thumbnail ${index + 1}`} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT COLUMN - Product Info (40%) */}
                    <div className="image-modal-right">
                        <div className="product-info-section">
                            {/* Brand */}
                            {product?.brand && (
                                <div className="product-brand-badge">{product.brand}</div>
                            )}

                            {/* Product Name */}
                            <h2 className="product-name">{product?.name || 'Tên sản phẩm'}</h2>

                            {/* Price */}
                            <div className="product-price-section">
                                <div className="current-price">
                                    {product?.price ? `${product.price.toLocaleString()}₫` : 'Liên hệ'}
                                </div>
                                {product?.originalPrice && product.originalPrice > product.price && (
                                    <div className="original-price">
                                        {product.originalPrice.toLocaleString()}₫
                                    </div>
                                )}
                            </div>

                            {/* Specifications */}
                            <div className="product-specs">
                                <h4>Thông số kỹ thuật</h4>
                                <div className="spec-grid">
                                    {product?.brand && (
                                        <div className="spec-item">
                                            <span className="spec-label">Thương hiệu:</span>
                                            <span className="spec-value">{product.brand}</span>
                                        </div>
                                    )}
                                    {product?.processor && (
                                        <div className="spec-item">
                                            <span className="spec-label">CPU:</span>
                                            <span className="spec-value">{product.processor}</span>
                                        </div>
                                    )}
                                    {product?.ram && (
                                        <div className="spec-item">
                                            <span className="spec-label">RAM:</span>
                                            <span className="spec-value">{product.ram}</span>
                                        </div>
                                    )}
                                    {product?.storage && (
                                        <div className="spec-item">
                                            <span className="spec-label">Ổ cứng:</span>
                                            <span className="spec-value">{product.storage}</span>
                                        </div>
                                    )}
                                    {product?.screen && (
                                        <div className="spec-item">
                                            <span className="spec-label">Màn hình:</span>
                                            <span className="spec-value">{product.screen}</span>
                                        </div>
                                    )}
                                    {product?.graphics && (
                                        <div className="spec-item">
                                            <span className="spec-label">Card đồ họa:</span>
                                            <span className="spec-value">{product.graphics}</span>
                                        </div>
                                    )}
                                    {product?.category && (
                                        <div className="spec-item">
                                            <span className="spec-label">Danh mục:</span>
                                            <span className="spec-value">{product.category}</span>
                                        </div>
                                    )}
                                    {product?.stock !== undefined && (
                                        <div className="spec-item">
                                            <span className="spec-label">Tình trạng:</span>
                                            <span className="spec-value" style={{ color: product.stock > 0 ? '#28a745' : '#dc3545' }}>
                                                {product.stock > 0 ? `Còn ${product.stock} sản phẩm` : 'Hết hàng'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Description */}
                            {product?.description && (
                                <div className="product-description">
                                    <h4>Mô tả sản phẩm</h4>
                                    <p>{product.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ImageModal;
