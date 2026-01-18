import React, { useState, useEffect } from 'react';
import { FiCheckSquare, FiSquare } from 'react-icons/fi';
import './CompareButton.css';

const CompareButton = ({ product, onCompareChange }) => {
    const [isComparing, setIsComparing] = useState(false);

    useEffect(() => {
        // Check if product is in compare list
        const compareList = JSON.parse(localStorage.getItem('compareList') || '[]');
        setIsComparing(compareList.some(p => p._id === product._id));
    }, [product._id]);

    const handleToggleCompare = (e) => {
        e.preventDefault();
        e.stopPropagation();

        let compareList = JSON.parse(localStorage.getItem('compareList') || '[]');

        if (isComparing) {
            // Remove from compare list
            compareList = compareList.filter(p => p._id !== product._id);
            setIsComparing(false);
        } else {
            // Check if already have 4 products
            if (compareList.length >= 4) {
                alert('You can only compare up to 4 products at a time');
                return;
            }

            // Add to compare list
            compareList.push({
                _id: product._id,
                name: product.name,
                brand: product.brand,
                price: product.price,
                imageUrl: product.imageUrl
            });
            setIsComparing(true);
        }

        localStorage.setItem('compareList', JSON.stringify(compareList));

        // Notify parent component
        if (onCompareChange) {
            onCompareChange(compareList);
        }

        // Dispatch custom event for other components to listen
        window.dispatchEvent(new CustomEvent('compareListUpdated', { 
            detail: { compareList } 
        }));
    };

    return (
        <button
            className={`compare-btn ${isComparing ? 'active' : ''}`}
            onClick={handleToggleCompare}
            title={isComparing ? 'Remove from comparison' : 'Add to comparison'}
        >
            {isComparing ? (
                <>
                    <FiCheckSquare /> Comparing
                </>
            ) : (
                <>
                    <FiSquare /> Compare
                </>
            )}
        </button>
    );
};

export default CompareButton;
