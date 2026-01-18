import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetailTest = () => {
    const { id } = useParams();
    
    return (
        <div style={{ padding: '50px', textAlign: 'center' }}>
            <h1>✅ Product Detail Route Works!</h1>
            <p>Product ID: <strong>{id}</strong></p>
            <p>This is a test page to verify routing is working correctly.</p>
        </div>
    );
};

export default ProductDetailTest;
