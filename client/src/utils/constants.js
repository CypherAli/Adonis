/**
 * Centralized constants file
 * Giúp dễ maintain và update data
 */

// Brand list
export const BRANDS = [
    'All', 
    'Dell', 
    'HP', 
    'Lenovo', 
    'ASUS', 
    'Acer', 
    'MSI', 
    'Apple', 
    'Microsoft', 
    'Razer'
];

// RAM options
export const RAM_OPTIONS = [
    'All', 
    '4GB', 
    '8GB', 
    '16GB', 
    '32GB', 
    '64GB'
];

// Processor options
export const PROCESSOR_OPTIONS = [
    'All',
    'Intel Core i3',
    'Intel Core i5',
    'Intel Core i7',
    'Intel Core i9',
    'AMD Ryzen 3',
    'AMD Ryzen 5',
    'AMD Ryzen 7',
    'AMD Ryzen 9',
    'Apple M1',
    'Apple M2',
    'Apple M3'
];

// Sort options
export const SORT_OPTIONS = [
    { value: '', label: 'Mới nhất' },
    { value: 'price_asc', label: 'Giá: Thấp → Cao' },
    { value: 'price_desc', label: 'Giá: Cao → Thấp' },
    { value: 'popularity', label: 'Phổ biến nhất' }
];

// Product categories
export const CATEGORIES = [
    { name: 'Gaming', icon: '🎮', label: 'Gaming Laptops' },
    { name: 'Business', icon: '💼', label: 'Business Laptops' },
    { name: 'Creator', icon: '🎨', label: 'Creator Laptops' },
    { name: 'Ultrabook', icon: '⚡', label: 'Ultrabooks' },
    { name: 'Budget', icon: '💰', label: 'Budget Laptops' }
];

// API Endpoints
export const API_ENDPOINTS = {
    PRODUCTS: '/products',
    BRANDS: '/products/brands',
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    ORDERS: '/orders',
    MY_ORDERS: '/orders/my-orders'
};

// Local Storage Keys
export const STORAGE_KEYS = {
    TOKEN: 'token',
    CART: 'cart',
    WISHLIST: 'wishlist',
    USER: 'user'
};

// Default filter values
export const DEFAULT_FILTERS = {
    search: '',
    maxPrice: '',
    minPrice: '',
    brand: 'All',
    ram: 'All',
    processor: 'All',
    inStock: true,
    sortBy: ''
};

// Pagination
export const ITEMS_PER_PAGE = 12;
export const BEST_SELLERS_LIMIT = 5;

// Toast duration
export const TOAST_DURATION = 3000;

// Validation
export const PASSWORD_MIN_LENGTH = 6;
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
