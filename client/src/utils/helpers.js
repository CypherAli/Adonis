/**
 * Helper functions
 * Tái sử dụng logic chung
 */

/**
 * Format number to VND currency
 */
export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount);
};

/**
 * Format number with commas
 */
export const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

/**
 * Calculate discount percentage
 */
export const calculateDiscount = (originalPrice, currentPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round((1 - currentPrice / originalPrice) * 100);
};

/**
 * Validate email
 */
export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password
 */
export const isValidPassword = (password, minLength = 6) => {
    return password && password.length >= minLength;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 100) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Scroll to element
 */
export const scrollToElement = (selector, behavior = 'smooth') => {
    const element = document.querySelector(selector);
    if (element) {
        element.scrollIntoView({ behavior, block: 'start' });
    }
};

/**
 * Get query params from URL
 */
export const getQueryParams = (search) => {
    return new URLSearchParams(search);
};

/**
 * Debounce function
 */
export const debounce = (func, delay = 500) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

/**
 * Check if product is on sale
 */
export const isOnSale = (product) => {
    return product.originalPrice && product.originalPrice > product.price;
};

/**
 * Get product discount amount
 */
export const getDiscountAmount = (product) => {
    if (!isOnSale(product)) return 0;
    return product.originalPrice - product.price;
};

/**
 * Format date
 */
export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
};

/**
 * Generate random number in range
 */
export const randomInRange = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
