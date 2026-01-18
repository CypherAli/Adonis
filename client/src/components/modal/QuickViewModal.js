import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiShoppingCart } from 'react-icons/fi';
import { PLACEHOLDER_IMAGES } from '../../utils/placeholder';
import ImageModal from './ImageModal';
import './QuickViewModal.css';

const QuickViewModal = ({ product, onClose, onAddToCart }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [showImageModal, setShowImageModal] = useState(false);
    const [modalImageIndex, setModalImageIndex] = useState(0);

    useEffect(() => {
        // Reset states when product changes
        if (product) {
            setSelectedImage(null);
        }
        
        // Disable body scroll when modal is open
        document.body.style.overflow = 'hidden';
        
        // Handle ESC key press
        const handleEscKey = (e) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        
        document.addEventListener('keydown', handleEscKey);
        
        return () => {
            document.body.style.overflow = 'unset';
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [product, onClose]);

    // Create display product with default values
    const displayProduct = useMemo(() => {
        if (!product) return null;
        
        // Get specifications from either direct properties or nested specifications object
        const specs = product.specifications || {};
        
        // Debug: Check what data we have
        console.log('🔍 QuickView Product:', {
            name: product.name,
            hasSpecs: !!product.specifications,
            specsProcessor: specs.processor,
            directProcessor: product.processor
        });
        
        return {
            ...product,
            // Prioritize specifications object over direct properties
            processor: specs.processor || product.processor || 'Updating...',
            ram: specs.ram || product.ram || 'Updating...',
            storage: specs.storage || product.storage || 'Updating...',
            screen: specs.display || product.screen || 'Updating...',
            graphics: specs.graphics || product.graphics || 'Tích hợp',
            os: specs.operatingSystem || product.os || 'Windows 11',
            weight: specs.weight || product.weight || '~2kg',
            description: product.description || 'Genuine laptop product with powerful configuration, modern design, suitable for work and entertainment. Official nationwide warranty.',
            features: product.features && product.features.length > 0 ? product.features : [
                'Brand new 100%, original seal',
                'Bảo hành chính hãng 12-36 tháng',
                'Nationwide delivery, flexible payment',
                '0% interest installment support',
                'Tặng kèm balo + chuột không dây'
            ],
            brand: product.brand || 'Laptop',
            name: product.name || 'Laptop product'
        };
    }, [product]);

    // Prepare all images for modal - using useMemo to ensure it updates with displayProduct
    const allImages = useMemo(() => {
        if (!displayProduct) return [];
        return [
            displayProduct.imageUrl || PLACEHOLDER_IMAGES.product,
            ...(displayProduct.images || [])
        ];
    }, [displayProduct]);

    if (!displayProduct) return null;

    const displayImage = selectedImage || displayProduct.imageUrl || PLACEHOLDER_IMAGES.product;

    const handleCloseImageModal = () => {
        setShowImageModal(false);
    };

    // eslint-disable-next-line no-unused-vars
    const handleOpenImageModal = (index) => {
        setModalImageIndex(index);
        setShowImageModal(true);
    };

    // Log final values for debugging
    console.log('📊 QuickView Final Display:', {
        processor: displayProduct.processor,
        ram: displayProduct.ram,
        storage: displayProduct.storage,
        screen: displayProduct.screen
    });

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="quickview-modal-container" onClick={(e) => e.stopPropagation()}>
                {/* Close Button */}
                <button className="quickview-close-btn" onClick={onClose}>
                    <FiX />
                </button>

                {/* Header với Gradient Tím */}
                <div className="quickview-header">
                    <h3>{displayProduct.name}</h3>
                </div>

                {/* Body - 2 Cột */}
                <div className="quickview-body">
                    {/* LEFT - Images (60%) */}
                    <div className="quickview-left">
                        {/* Main Image với Zoom */}
                        <div className="quickview-main-image">
                            <img 
                                src={displayImage}
                                alt={displayProduct.name}
                                onError={(e) => e.target.src = PLACEHOLDER_IMAGES.product}
                                className="zoomable-image"
                            />
                        </div>

                        {/* Thumbnails */}
                        {displayProduct.images && displayProduct.images.length > 0 && (
                            <div className="quickview-thumbnails">
                                <div 
                                    className={`quickview-thumb ${!selectedImage ? 'active' : ''}`}
                                    onClick={() => setSelectedImage(null)}
                                >
                                    <img 
                                        src={displayProduct.imageUrl || PLACEHOLDER_IMAGES.productSmall}
                                        alt={displayProduct.name}
                                        onError={(e) => e.target.src = PLACEHOLDER_IMAGES.productSmall}
                                    />
                                </div>
                                {displayProduct.images.map((img, idx) => (
                                    <div 
                                        key={idx}
                                        className={`quickview-thumb ${selectedImage === img ? 'active' : ''}`}
                                        onClick={() => setSelectedImage(img)}
                                    >
                                        <img 
                                            src={img}
                                            alt={`${displayProduct.name} - ${idx + 1}`}
                                            onError={(e) => e.target.src = PLACEHOLDER_IMAGES.productSmall}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* RIGHT - Product Info (40%) */}
                    <div className="quickview-right">
                        {/* Brand Badge */}
                        {displayProduct.brand && (
                            <div className="quickview-brand-badge">{displayProduct.brand}</div>
                        )}

                        {/* Product Name */}
                        <h2 className="quickview-product-name">{displayProduct.name}</h2>

                        {/* Price */}
                        <div className="quickview-price-section">
                            <div className="quickview-current-price">
                                {displayProduct.price.toLocaleString()}₫
                            </div>
                            {displayProduct.originalPrice && displayProduct.originalPrice > displayProduct.price && (
                                <div className="quickview-original-price">
                                    {displayProduct.originalPrice.toLocaleString()}₫
                                </div>
                            )}
                        </div>

                        {/* Specs */}
                        <div className="quickview-specs">
                            <h4>Specifications</h4>
                            <div className="quickview-spec-grid">
                                <div className="quickview-spec-item">
                                    <span className="spec-label">CPU:</span>
                                    <span className="spec-value">{displayProduct.processor}</span>
                                </div>
                                <div className="quickview-spec-item">
                                    <span className="spec-label">RAM:</span>
                                    <span className="spec-value">{displayProduct.ram}</span>
                                </div>
                                <div className="quickview-spec-item">
                                    <span className="spec-label">Storage:</span>
                                    <span className="spec-value">{displayProduct.storage}</span>
                                </div>
                                <div className="quickview-spec-item">
                                    <span className="spec-label">Display:</span>
                                    <span className="spec-value">{displayProduct.screen}</span>
                                </div>
                                {displayProduct.graphics && (
                                    <div className="quickview-spec-item">
                                        <span className="spec-label">Graphics:</span>
                                        <span className="spec-value">{displayProduct.graphics}</span>
                                    </div>
                                )}
                                {displayProduct.os && (
                                    <div className="quickview-spec-item">
                                        <span className="spec-label">OS:</span>
                                        <span className="spec-value">{displayProduct.os}</span>
                                    </div>
                                )}
                                {displayProduct.weight && (
                                    <div className="quickview-spec-item">
                                        <span className="spec-label">Weight:</span>
                                        <span className="spec-value">{displayProduct.weight}</span>
                                    </div>
                                )}
                                {displayProduct.specifications?.battery && (
                                    <div className="quickview-spec-item">
                                        <span className="spec-label">Battery:</span>
                                        <span className="spec-value">{displayProduct.specifications.battery}</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description */}
                        <div className="quickview-description">
                            <h4>Product Description</h4>
                            <p className="description-text">{displayProduct.description}</p>
                        </div>

                        {/* Features */}
                        {displayProduct.features && displayProduct.features.length > 0 && (
                            <div className="quickview-features">
                                <h4>Highlights</h4>
                                <ul className="features-list">
                                    {displayProduct.features.map((feature, index) => (
                                        <li key={index}>✓ {feature}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Stock Status */}
                        <div className="quickview-stock-status" style={{
                            padding: '12px 20px',
                            borderRadius: '8px',
                            marginBottom: '15px',
                            background: (displayProduct.stock && displayProduct.stock > 0) ? '#d4edda' : '#f8d7da',
                            color: (displayProduct.stock && displayProduct.stock > 0) ? '#155724' : '#721c24',
                            fontWeight: 'bold',
                            textAlign: 'center'
                        }}>
                            {(displayProduct.stock && displayProduct.stock > 0) 
                                ? `✓ Còn ${displayProduct.stock} sản phẩm` 
                                : '✗ Hết hàng'
                            }
                        </div>

                        {/* Action Buttons */}
                        <div className="quickview-actions">
                            <button 
                                className="quickview-btn-cart"
                                onClick={() => {
                                    onAddToCart(displayProduct);
                                    onClose();
                                }}
                                disabled={!displayProduct.stock || displayProduct.stock <= 0}
                                style={{
                                    opacity: (!displayProduct.stock || displayProduct.stock <= 0) ? 0.5 : 1,
                                    cursor: (!displayProduct.stock || displayProduct.stock <= 0) ? 'not-allowed' : 'pointer'
                                }}
                            >
                                <FiShoppingCart /> {(displayProduct.stock && displayProduct.stock > 0) ? 'Thêm vào giỏ' : 'Hết hàng'}
                            </button>
                            <Link 
                                to={`/product/${displayProduct._id}`}
                                className="quickview-btn-detail"
                                onClick={onClose}
                            >
                                Xem chi tiết
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Image Modal - Popup to view images in full size - Rendered outside QuickView */}
            {showImageModal && (
                <ImageModal 
                    isOpen={showImageModal}
                    onClose={handleCloseImageModal}
                    images={allImages}
                    initialIndex={modalImageIndex}
                    productName={displayProduct.name}
                    product={displayProduct}
                />
            )}
        </div>
    );
};

export default QuickViewModal;
