import React, { useState, useEffect } from 'react';
import { FiX, FiEye } from 'react-icons/fi';
import ProductComparison from '../product/ProductComparison';
import './CompareBar.css';

const CompareBar = () => {
    const [compareList, setCompareList] = useState([]);
    const [showComparison, setShowComparison] = useState(false);

    useEffect(() => {
        // Load initial compare list
        updateCompareList();

        // Listen for compare list updates
        const handleCompareListUpdate = (event) => {
            setCompareList(event.detail.compareList || []);
        };

        window.addEventListener('compareListUpdated', handleCompareListUpdate);

        return () => {
            window.removeEventListener('compareListUpdated', handleCompareListUpdate);
        };
    }, []);

    const updateCompareList = () => {
        const list = JSON.parse(localStorage.getItem('compareList') || '[]');
        setCompareList(list);
    };

    const handleRemoveProduct = (productId) => {
        const newList = compareList.filter(p => p._id !== productId);
        localStorage.setItem('compareList', JSON.stringify(newList));
        setCompareList(newList);
        
        // Dispatch event to update other components
        window.dispatchEvent(new CustomEvent('compareListUpdated', { 
            detail: { compareList: newList } 
        }));
    };

    const handleClearAll = () => {
        localStorage.removeItem('compareList');
        setCompareList([]);
        
        window.dispatchEvent(new CustomEvent('compareListUpdated', { 
            detail: { compareList: [] } 
        }));
    };

    const handleCompare = () => {
        if (compareList.length < 2) {
            alert('Please select at least 2 products to compare');
            return;
        }
        setShowComparison(true);
    };

    if (compareList.length === 0) {
        return null;
    }

    return (
        <>
            <div className="compare-bar">
                <div className="compare-bar-content">
                    <div className="compare-info">
                        <h3>Compare Products ({compareList.length}/4)</h3>
                        <button className="clear-all-btn" onClick={handleClearAll}>
                            Clear All
                        </button>
                    </div>

                    <div className="compare-items">
                        {compareList.map((product) => (
                            <div key={product._id} className="compare-item">
                                <img 
                                    src={product.imageUrl} 
                                    alt={product.name}
                                />
                                <div className="item-info">
                                    <p className="item-name">{product.name}</p>
                                    <p className="item-brand">{product.brand}</p>
                                </div>
                                <button
                                    className="remove-item-btn"
                                    onClick={() => handleRemoveProduct(product._id)}
                                    title="Remove"
                                >
                                    <FiX />
                                </button>
                            </div>
                        ))}

                        {/* Empty slots */}
                        {[...Array(4 - compareList.length)].map((_, i) => (
                            <div key={`empty-${i}`} className="compare-item empty">
                                <p>Add product to compare</p>
                            </div>
                        ))}
                    </div>

                    <button 
                        className="compare-now-btn"
                        onClick={handleCompare}
                        disabled={compareList.length < 2}
                    >
                        <FiEye /> Compare Now
                    </button>
                </div>
            </div>

            {showComparison && (
                <ProductComparison
                    productIds={compareList.map(p => p._id)}
                    onClose={() => setShowComparison(false)}
                />
            )}
        </>
    );
};

export default CompareBar;
