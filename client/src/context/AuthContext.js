import React, { createContext, useState, useEffect } from 'react';
import axios from '../api/axiosConfig';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [userDetails, setUserDetails] = useState(() => {
        const saved = localStorage.getItem('userDetails');
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (token) {
            try {
                const decodedUser = jwtDecode(token);
                
                // Check if token is expired
                const currentTime = Date.now() / 1000;
                if (decodedUser.exp < currentTime) {
                    console.warn("Token has expired");
                    setUser(null);
                    setToken(null);
                    setUserDetails(null);
                    localStorage.removeItem('token');
                    localStorage.removeItem('userDetails');
                    return;
                }
                
                setUser(decodedUser);
                localStorage.setItem('token', token);
                
                // Fetch fresh user details if not already loaded
                if (!userDetails) {
                    fetchUserDetails();
                }
            } catch (error) {
                console.error("Invalid token:", error);
                setUser(null);
                setToken(null);
                setUserDetails(null);
                localStorage.removeItem('token');
                localStorage.removeItem('userDetails');
            }
        } else {
            setUser(null);
            setUserDetails(null);
            localStorage.removeItem('token');
            localStorage.removeItem('userDetails');
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [token]);

    const fetchUserDetails = async () => {
        try {
            const res = await axios.get('/user/profile');
            if (res.data) {
                setUserDetails(res.data);
                localStorage.setItem('userDetails', JSON.stringify(res.data));
                console.log('✅ User details fetched from server:', res.data);
            }
        } catch (error) {
            console.error('Failed to fetch user details:', error);
            // Keep using cached userDetails if fetch fails
        }
    };

    const login = async (email, password) => {
        try {
            const res = await axios.post('/auth/login', { email, password });
            
            // Show warning if partner not approved
            if (res.data.warning) {
                console.warn('⚠️', res.data.warning);
            }
            
            // Save token and user data
            const { token, user: userData } = res.data;
            
            // Store in localStorage first
            localStorage.setItem('token', token);
            if (userData) {
                localStorage.setItem('userDetails', JSON.stringify(userData));
            }
            
            // Decode and set user state
            const decodedUser = jwtDecode(token);
            setUser(decodedUser);
            setUserDetails(userData);
            setToken(token); // This triggers useEffect but user is already set
            
            console.log('✅ Login successful:', decodedUser);
            
            return res.data;
        } catch (err) {
            console.error('❌ Login failed:', err);
            throw err;
        }
    };

    const register = async (username, email, password, role = 'client', shopName = null) => {
        try {
            const payload = { username, email, password, role };
            if (role === 'partner' && shopName) {
                payload.shopName = shopName;
            }
            await axios.post('/auth/register', payload);
        } catch (err) {
            console.error('Registration failed', err);
            throw err;
        }
    };

    const logout = () => {
        setToken(null);
        setUserDetails(null);
        localStorage.removeItem('userDetails');
    };

    const updateUser = (userData) => {
        setUserDetails(userData);
        localStorage.setItem('userDetails', JSON.stringify(userData));
    };

    return (
        <AuthContext.Provider value={{ user, userDetails, token, login, logout, register, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;