import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from '../api/axiosConfig';
import AuthContext from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load cart on mount and when user changes
    useEffect(() => {
        if (user) {
            loadCartFromAPI();
        } else {
            loadCartFromLocalStorage();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    // Load from localStorage (for guest users)
    const loadCartFromLocalStorage = () => {
        try {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                const parsedCart = JSON.parse(savedCart);
                if (Array.isArray(parsedCart)) {
                    setCartItems(parsedCart);
                } else {
                    console.warn('Invalid cart data in localStorage');
                    localStorage.removeItem('cart');
                }
            }
        } catch (error) {
            console.error('Failed to load cart:', error);
            localStorage.removeItem('cart');
        }
    };

    // Load from API (for logged in users)
    const loadCartFromAPI = async () => {
        setLoading(true);
        try {
            // Clear localStorage to prevent stale data
            localStorage.removeItem('cart');
            
            const response = await axios.get('/cart');
            console.log('🔍 RAW API RESPONSE:', response.data);
            console.log('🔍 ITEMS:', response.data.items);
            
            const apiCart = response.data.items.map(item => {
                console.log('🔍 ITEM:', item);
                console.log('   - sellerName from API:', item.sellerName);
                console.log('   - seller object:', item.seller);
                
                const mappedItem = {
                    _id: item.product._id,
                    ...item.product,
                    quantity: item.quantity,
                    cartItemId: item._id, // Store cart item ID for updates
                    seller: item.seller, // Include seller object
                    sellerName: item.sellerName || item.seller?.shopName || item.seller?.username || 'Unknown Shop'
                };
                
                console.log('   - MAPPED sellerName:', mappedItem.sellerName);
                return mappedItem;
            });
            
            console.log('🔍 MAPPED CART:', apiCart);
            setCartItems(apiCart);
            
            // Sync to localStorage
            localStorage.setItem('cart', JSON.stringify(apiCart));
        } catch (error) {
            console.error('Failed to load cart from API:', error);
            loadCartFromLocalStorage();
        } finally {
            setLoading(false);
        }
    };

    // Save cart to localStorage whenever it changes (for guest users)
    useEffect(() => {
        if (!user) {
            try {
                localStorage.setItem('cart', JSON.stringify(cartItems));
            } catch (error) {
                console.error('Failed to save cart:', error);
            }
        }
    }, [cartItems, user]);

    const addToCart = async (product, quantity = 1) => {
        if (user) {
            // Add to API
            try {
                const response = await axios.post('/cart', { 
                    productId: product._id, 
                    quantity 
                });
                
                console.log('🔍 ADD TO CART RESPONSE:', response.data);
                
                // Update local state from API response WITH seller info
                const apiCart = response.data.items.map(item => {
                    console.log('🔍 Mapping item after add:', item);
                    return {
                        _id: item.product._id,
                        ...item.product,
                        quantity: item.quantity,
                        cartItemId: item._id,
                        seller: item.seller,
                        sellerName: item.sellerName || item.seller?.shopName || item.seller?.username || 'Unknown Shop'
                    };
                });
                
                console.log('🔍 MAPPED CART after add:', apiCart);
                setCartItems(apiCart);
                
                // Update localStorage
                localStorage.setItem('cart', JSON.stringify(apiCart));
            } catch (error) {
                console.error('Failed to add to cart:', error);
                throw error;
            }
        } else {
            // Add to localStorage
            setCartItems(prevItems => {
                const existingItem = prevItems.find(item => item._id === product._id);
                
                if (existingItem) {
                    return prevItems.map(item =>
                        item._id === product._id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    );
                } else {
                    return [...prevItems, { ...product, quantity }];
                }
            });
        }
    };

    const removeFromCart = async (productId) => {
        if (user) {
            // Find the cart item ID
            const item = cartItems.find(i => i._id === productId);
            if (!item || !item.cartItemId) return;
            
            try {
                await axios.delete(`/cart/${item.cartItemId}`);
                setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
            } catch (error) {
                console.error('Failed to remove from cart:', error);
                throw error;
            }
        } else {
            setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
        }
    };

    const updateQuantity = async (productId, quantity) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        if (user) {
            // Find the cart item ID
            const item = cartItems.find(i => i._id === productId);
            if (!item || !item.cartItemId) return;
            
            try {
                const response = await axios.put(`/cart/${item.cartItemId}`, { quantity });
                
                console.log('🔍 UPDATE QUANTITY RESPONSE:', response.data);
                
                // Update local state from API response WITH seller info
                const apiCart = response.data.items.map(item => ({
                    _id: item.product._id,
                    ...item.product,
                    quantity: item.quantity,
                    cartItemId: item._id,
                    seller: item.seller,
                    sellerName: item.sellerName || item.seller?.shopName || item.seller?.username || 'Unknown Shop'
                }));
                
                setCartItems(apiCart);
                
                // Update localStorage
                localStorage.setItem('cart', JSON.stringify(apiCart));
            } catch (error) {
                console.error('Failed to update quantity:', error);
                throw error;
            }
        } else {
            setCartItems(prevItems =>
                prevItems.map(item =>
                    item._id === productId
                        ? { ...item, quantity }
                        : item
                )
            );
        }
    };

    const clearCart = async () => {
        if (user) {
            try {
                await axios.delete('/cart/clear/all');
            } catch (error) {
                console.error('Failed to clear cart:', error);
            }
        }
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
    };

    const getCartCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            loading,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart,
            getCartTotal,
            getCartCount
        }}>
            {children}
        </CartContext.Provider>
    );
};

export default CartContext;
