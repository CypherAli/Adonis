import React, { useContext, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2 } from 'react-icons/fi';
import CartContext from '../../context/CartContext';
import ProductImage from '../product/ProductImage';
import './CartSidebar.css';

const CartSidebar = ({ isOpen, onClose }) => {
    const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useContext(CartContext);

    // Close sidebar when clicking outside
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleBackdropClick = (e) => {
        if (e.target.classList.contains('cart-sidebar-backdrop')) {
            onClose();
        }
    };

    const handleQuantityChange = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        updateQuantity(productId, newQuantity);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    // Safety check - nếu cartItems undefined, return empty sidebar
    if (!cartItems) {
        return null;
    }

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div 
                    className="cart-sidebar-backdrop" 
                    onClick={handleBackdropClick}
                />
            )}

            {/* Sidebar */}
            <div className={`cart-sidebar ${isOpen ? 'open' : ''}`}>
                {/* Header */}
                <div className="cart-sidebar-header">
                    <h2>Shopping Cart</h2>
                    <button className="close-btn" onClick={onClose}>
                        <FiX />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="cart-sidebar-items">
                    {cartItems.length === 0 ? (
                        <div className="empty-cart">
                            <div className="empty-cart-icon">🛒</div>
                            <p>Giỏ hàng trống</p>
                            <button className="continue-shopping-btn" onClick={onClose}>
                                Tiếp tục mua sắm
                            </button>
                        </div>
                    ) : (
                        cartItems.map((item) => (
                            <div key={item._id} className="cart-sidebar-item">
                                {/* Product Image */}
                                <div className="item-image">
                                    <ProductImage 
                                        product={item}
                                        alt={item.name}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="item-details">
                                    <h4 className="item-name">{item.name}</h4>
                                    
                                    {/* Quantity Controls */}
                                    <div className="item-quantity">
                                        <button 
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                            disabled={item.quantity <= 1}
                                        >
                                            <FiMinus />
                                        </button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button 
                                            className="qty-btn"
                                            onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                        >
                                            <FiPlus />
                                        </button>
                                    </div>

                                    {/* Price */}
                                    <div className="item-price">
                                        <span className="price-value">
                                            {formatPrice(item.price * item.quantity)} EGP
                                        </span>
                                    </div>
                                </div>

                                {/* Remove Button */}
                                <button 
                                    className="remove-btn"
                                    onClick={() => removeFromCart(item._id)}
                                    title="Xóa sản phẩm"
                                >
                                    <FiTrash2 />
                                </button>
                            </div>
                        ))
                    )}
                </div>

                {/* Footer - Subtotal and Actions */}
                {cartItems.length > 0 && (
                    <div className="cart-sidebar-footer">
                        <div className="subtotal-row">
                            <span className="subtotal-label">SUBTOTAL:</span>
                            <span className="subtotal-value">{formatPrice(getCartTotal())} EGP</span>
                        </div>

                        <div className="footer-actions">
                            <Link 
                                to="/cart" 
                                className="view-cart-btn"
                                onClick={onClose}
                            >
                                View cart
                            </Link>
                            <Link 
                                to="/checkout" 
                                className="checkout-btn"
                                onClick={onClose}
                            >
                                Checkout
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
