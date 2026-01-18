import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMinus, FiMaximize2, FiUsers } from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import axios from 'axios';
import './PartnerChatWidget.css';

const AnonymousChatWidget = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showPartnerList, setShowPartnerList] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const [anonymousId, setAnonymousId] = useState(null);
    const [anonymousName, setAnonymousName] = useState('Khách');
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef(null);
    const pollingIntervalRef = useRef(null);

    // Get or create anonymous ID
    useEffect(() => {
        let id = localStorage.getItem('anonymousId');
        if (!id) {
            id = `anon_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            localStorage.setItem('anonymousId', id);
        }
        setAnonymousId(id);

        const name = localStorage.getItem('anonymousName') || 'Guest';
        setAnonymousName(name);
    }, []);

    useEffect(() => {
        if (isOpen && partners.length === 0) {
            fetchPartners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Polling for new messages (for anonymous users without socket)
    useEffect(() => {
        if (conversationId && !user) {
            // Start polling every 3 seconds
            pollingIntervalRef.current = setInterval(() => {
                fetchMessages(conversationId);
            }, 3000);

            return () => {
                if (pollingIntervalRef.current) {
                    clearInterval(pollingIntervalRef.current);
                }
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [conversationId, user]);

    const getHeaders = () => {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (user) {
            headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
        } else {
            headers['X-Anonymous-Id'] = anonymousId;
            headers['X-Anonymous-Name'] = anonymousName;
        }

        return headers;
    };

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(`${apiUrl}/partner/list-active`, {
                headers: user ? { 'Authorization': `Bearer ${localStorage.getItem('token')}` } : {}
            });
            
            if (response.data.success) {
                setPartners(response.data.partners || []);
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const createOrGetConversation = async (partnerId) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.post(
                `${apiUrl}/chat/conversations`,
                {
                    targetUserId: partnerId,
                    subject: 'Product Consultation'
                },
                { headers: getHeaders() }
            );

            if (response.data.success) {
                const convId = response.data.conversation._id;
                setConversationId(convId);
                
                // Save conversation ID for this partner
                if (!user) {
                    localStorage.setItem(`conversation_${partnerId}`, convId);
                }
                
                return convId;
            }
        } catch (error) {
            console.error('Error creating conversation:', error);
            return null;
        }
    };

    const fetchMessages = async (convId) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.get(
                `${apiUrl}/chat/conversations/${convId}/messages`,
                { headers: getHeaders() }
            );

            if (response.data.success) {
                setMessages(response.data.messages || []);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleOpenChat = () => {
        setIsOpen(true);
        setIsMinimized(false);
    };

    const handleClose = () => {
        setIsOpen(false);
        setIsMinimized(false);
        setShowPartnerList(true);
        setSelectedPartner(null);
        setConversationId(null);
        
        // Stop polling
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleSelectPartner = async (partner) => {
        setSelectedPartner(partner);
        setShowPartnerList(false);
        
        // Clear old anonymous conversation IDs when logged in
        if (user) {
            // Don't use localStorage conversation ID for authenticated users
            const convId = await createOrGetConversation(partner._id);
            if (convId) {
                await fetchMessages(convId);
            }
        } else {
            // For anonymous users, try to get existing conversation ID from localStorage
            let convId = localStorage.getItem(`conversation_${partner._id}`);
            
            // Create or get conversation
            if (!convId) {
                convId = await createOrGetConversation(partner._id);
            } else {
                setConversationId(convId);
            }
            
            // Fetch messages
            if (convId) {
                await fetchMessages(convId);
            }
        }
    };

    const handleBackToList = () => {
        setShowPartnerList(true);
        setSelectedPartner(null);
        setMessages([]);
        setConversationId(null);
        
        // Stop polling
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!messageInput.trim() || !conversationId || isSending) return;

        setIsSending(true);
        
        // Temporarily stop polling to avoid conflicts
        if (pollingIntervalRef.current) {
            clearInterval(pollingIntervalRef.current);
        }
        
        const tempId = `temp_${Date.now()}`;
        const messageData = {
            _id: tempId,
            message: messageInput.trim(),
            senderRole: user ? user.role : 'anonymous',
            anonymousName: user ? null : anonymousName,
            sender: user ? { username: user.username, _id: user._id } : null,
            createdAt: new Date(),
            isTemp: true
        };

        // Add to UI immediately
        setMessages(prev => [...prev, messageData]);
        const messageCopy = messageInput.trim();
        setMessageInput('');

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await axios.post(
                `${apiUrl}/chat/conversations/${conversationId}/messages`,
                { message: messageCopy },
                { headers: getHeaders() }
            );

            if (response.data.success) {
                // Replace temp message with real one
                setMessages(prev => 
                    prev.map(msg => 
                        msg._id === tempId ? { ...response.data.message, isTemp: false } : msg
                    )
                );
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove temp message if failed
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            
            // Show user-friendly error message
            const errorMsg = error.response?.data?.message || 'Không thể gửi tin nhắn. Vui lòng thử lại.';
            alert(errorMsg);
        } finally {
            setIsSending(false);
            
            // Restart polling for anonymous users after a short delay
            if (!user && conversationId) {
                setTimeout(() => {
                    if (!pollingIntervalRef.current && conversationId) {
                        pollingIntervalRef.current = setInterval(() => {
                            fetchMessages(conversationId);
                        }, 3000);
                    }
                }, 1000);
            }
        }
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    const getSenderName = (msg) => {
        if (msg.senderRole === 'anonymous') {
            return msg.anonymousName || 'Guest';
        }
        if (msg.sender) {
            return msg.sender.shopName || msg.sender.username || 'Partner';
        }
        return 'User';
    };

    const isOwnMessage = (msg) => {
        if (user) {
            return msg.sender && msg.sender._id === (user._id || user.id);
        } else {
            return msg.senderRole === 'anonymous' && msg.anonymousId === anonymousId;
        }
    };

    return (
        <>
            {/* Chat Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        className="partner-chat-button"
                        onClick={handleOpenChat}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="Chat with Shop"
                    >
                        <FiMessageCircle size={24} />
                        <span className="button-label">
                            {user ? 'Chat Shop' : 'Ask Shop'}
                        </span>
                        {!user && (
                            <span className="anonymous-badge">No login required</span>
                        )}
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className={`partner-chat-container ${isMinimized ? 'minimized' : ''}`}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                    >
                        {/* Header */}
                        <div className="partner-chat-header">
                            <div className="header-left">
                                {!showPartnerList && selectedPartner && (
                                    <button 
                                        onClick={handleBackToList}
                                        className="back-button"
                                        title="Back to list"
                                    >
                                        ←
                                    </button>
                                )}
                                <FiMessageCircle size={20} />
                                <h4>
                                    {showPartnerList 
                                        ? 'Select Shop' 
                                        : selectedPartner?.name || selectedPartner?.businessName || 'Shop'}
                                </h4>
                                {!user && (
                                    <span className="anonymous-indicator" title={`ID: ${anonymousId}`}>
                                        (Guest)
                                    </span>
                                )}
                            </div>
                            <div className="header-actions">
                                <button onClick={handleMinimize} title={isMinimized ? "Expand" : "Minimize"}>
                                    {isMinimized ? <FiMaximize2 size={18} /> : <FiMinus size={18} />}
                                </button>
                                <button onClick={handleClose} title="Close">
                                    <FiX size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content */}
                        {!isMinimized && (
                            <div className="partner-chat-content">
                                {showPartnerList ? (
                                    // Partner List
                                    <div className="partner-list">
                                        {!user && (
                                            <div className="anonymous-notice">
                                                <p>💬 You are chatting as a guest</p>
                                                <small>Login to save chat history</small>
                                            </div>
                                        )}
                                        {loading ? (
                                            <div className="loading-state">
                                                <div className="spinner"></div>
                                                <p>Loading shop list...</p>
                                            </div>
                                        ) : partners.length === 0 ? (
                                            <div className="empty-state">
                                                <FiUsers size={48} />
                                                <p>No shops available</p>
                                            </div>
                                        ) : (
                                            <div className="partner-items">
                                                {partners.map((partner) => (
                                                    <motion.div
                                                        key={partner._id}
                                                        className="partner-item"
                                                        onClick={() => handleSelectPartner(partner)}
                                                        whileHover={{ scale: 1.02 }}
                                                        whileTap={{ scale: 0.98 }}
                                                    >
                                                        <div className="partner-avatar">
                                                            {partner.name?.charAt(0) || partner.businessName?.charAt(0) || 'S'}
                                                        </div>
                                                        <div className="partner-info">
                                                            <h5>{partner.name || partner.businessName || 'Shop'}</h5>
                                                            <p>{partner.email}</p>
                                                        </div>
                                                        <div className="partner-status online">●</div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    // Chat Messages
                                    <>
                                        <div className="messages-container">
                                            {messages.length === 0 ? (
                                                <div className="empty-chat">
                                                    <FiMessageCircle size={48} />
                                                    <p>Start conversation</p>
                                                    {!user && (
                                                        <small>You can ask about products, prices...</small>
                                                    )}
                                                </div>
                                            ) : (
                                                messages.map((msg) => (
                                                    <motion.div
                                                        key={msg._id}
                                                        className={`message ${isOwnMessage(msg) ? 'sent' : 'received'} ${msg.isTemp ? 'temp' : ''}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <div className="message-sender">
                                                            {getSenderName(msg)}
                                                        </div>
                                                        <div className="message-content">
                                                            {msg.message}
                                                        </div>
                                                        <div className="message-time">
                                                            {formatTime(msg.createdAt)}
                                                            {msg.isTemp && ' • Sending...'}
                                                        </div>
                                                    </motion.div>
                                                ))
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input Form */}
                                        <form className="message-input-form" onSubmit={handleSendMessage}>
                                            <input
                                                type="text"
                                                className="message-input"
                                                placeholder={user ? "Type a message..." : "Type your question..."}
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="send-button"
                                                disabled={!messageInput.trim() || isSending}
                                                title={isSending ? 'Đang gửi...' : 'Gửi tin nhắn'}
                                            >
                                                <FiSend size={18} />
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AnonymousChatWidget;
