import React from 'react';
import './CategoryBar.css';

const brands = [
    { name: 'DELL', icon: '💻', displayName: 'Dell' },
    { name: 'HP', icon: '🖥️', displayName: 'HP' },
    { name: 'LENOVO', icon: '⚡', displayName: 'Lenovo' },
    { name: 'ASUS', icon: '🎮', displayName: 'ASUS' },
    { name: 'ACER', icon: '💼', displayName: 'Acer' },
    { name: 'MSI', icon: '🚀', displayName: 'MSI' },
    { name: 'APPLE', icon: '🍎', displayName: 'Apple' }
];

const CategoryBar = ({ onBrandClick, selectedBrand }) => {
    const handleBrandClick = (brandName) => {
        // Scroll to products section
        const productsSection = document.querySelector('.homepage-container');
        if (productsSection) {
            productsSection.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Call parent handler if provided
        if (onBrandClick) {
            onBrandClick(brandName);
        }
    };

    return (
        <div className="category-bar-wrapper">
            <div className="category-bar">
                {brands.map((brand, index) => (
                    <div 
                        key={index} 
                        className={`category-item ${selectedBrand === brand.displayName ? 'active' : ''}`}
                        onClick={() => handleBrandClick(brand.displayName)}
                        role="button"
                        tabIndex={0}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') handleBrandClick(brand.displayName);
                        }}
                    >
                        <div className="category-icon-wrapper">
                            <span className="category-icon">{brand.icon}</span>
                        </div>
                        <div className="category-info">
                            <span className="category-name">{brand.name}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoryBar;

