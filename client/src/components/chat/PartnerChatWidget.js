import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMinus, FiMaximize2, FiUsers } from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';
import './PartnerChatWidget.css';

const PartnerChatWidget = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showPartnerList, setShowPartnerList] = useState(true);
    const [selectedPartner, setSelectedPartner] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [partners, setPartners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [socket, setSocket] = useState(null);
    const messagesEndRef = useRef(null);

    // Socket.IO setup - Only connect when widget is opened
    useEffect(() => {
        if (!user || !isOpen) return; // Only connect when chat is opened
        
        const userId = user._id || user.id;
        if (!userId) return;

        // Initialize Socket.IO
        const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });
        
        setSocket(newSocket);

    newSocket.on('connect', () => {
        console.log('✅ Client connected to chat');
        newSocket.emit('user:join', userId);
    });

    newSocket.on('disconnect', () => {
        console.log('❌ Disconnected');
    });        newSocket.on('chat:message', (message) => {
            console.log('📩 Received message:', message);
            
            const userId = user._id || user.id;
            
            // Only add if it's for current conversation
            if (selectedPartner && 
                ((message.senderId === userId && message.receiverId === selectedPartner._id) ||
                 (message.senderId === selectedPartner._id && message.receiverId === userId))) {
                
                setMessages(prev => {
                    // Check if message already exists (prevent duplicates)
                    const exists = prev.some(m => 
                        m._id === message._id || 
                        (m.message === message.message && 
                         m.senderId === message.senderId && 
                         Math.abs(new Date(m.createdAt) - new Date(message.createdAt)) < 2000)
                    );
                    
                    if (exists) {
                        console.log('⚠️ Duplicate message detected, skipping');
                        // If it's a temp message, replace with real one
                        return prev.map(m => 
                            m.isTemp && m.message === message.message && m.senderId === message.senderId
                                ? { ...message, isTemp: false }
                                : m
                        );
                    }
                    
                    return [...prev, message];
                });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [user, selectedPartner, isOpen]); // Add isOpen dependency

    useEffect(() => {
        if (isOpen && partners.length === 0) {
            fetchPartners();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/partner/list-active`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setPartners(data.partners || []);
            }
        } catch (error) {
            console.error('Error fetching partners:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (partnerId) => {
        try {
            const userId = user?._id || user?.id;
            if (!user || !userId) return;
            
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            const response = await fetch(`${apiUrl}/chat/history/${userId}/${partnerId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            const data = await response.json();
            
            if (data.success) {
                setMessages(data.messages || []);
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
    };

    const handleMinimize = () => {
        setIsMinimized(!isMinimized);
    };

    const handleSelectPartner = (partner) => {
        setSelectedPartner(partner);
        setShowPartnerList(false);
        fetchMessages(partner._id);
        
        // Join chat room via socket
        if (socket?.connected) {
            const userId = user._id || user.id;
            socket.emit('chat:join', { userId, partnerId: partner._id });
        }
    };

    const handleBackToList = () => {
        // Leave current chat room
        if (socket?.connected && selectedPartner) {
            const userId = user._id || user.id;
            socket.emit('chat:leave', { userId, partnerId: selectedPartner._id });
        }
        
        setShowPartnerList(true);
        setSelectedPartner(null);
        setMessages([]);
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        if (!messageInput.trim() || !selectedPartner || !user) return;

        const userId = user._id || user.id;
        
        const tempId = `temp_${Date.now()}`;
        const messageData = {
            _id: tempId,
            message: messageInput.trim(),
            senderId: userId,
            senderName: user.name || user.username || 'User',
            receiverId: selectedPartner._id,
            receiverName: selectedPartner.name || selectedPartner.businessName || 'Partner',
            createdAt: new Date(),
            isTemp: true
        };

        // Add to UI immediately for instant feedback
        setMessages(prev => [...prev, messageData]);
        setMessageInput('');

        try {
            // Send via Socket.IO (server will save to DB and emit to receiver)
            if (socket?.connected) {
                console.log('📤 Sending via socket:', messageData.message);
                socket.emit('chat:send', messageData);
                
                // Mark as sent after a short delay
                setTimeout(() => {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg._id === tempId ? { ...msg, isTemp: false } : msg
                        )
                    );
                }, 500);
            } else {
                // Fallback to API if socket not connected
                const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
                
                const payload = {
                    senderId: userId,
                    senderName: user.name || user.username || 'User',
                    receiverId: selectedPartner._id,
                    receiverName: selectedPartner.name || selectedPartner.businessName || 'Partner',
                    message: messageData.message
                };
                
                console.log('📤 Sending via API (fallback):', payload);
                
                const response = await fetch(`${apiUrl}/chat/send`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (data.success) {
                    setMessages(prev => 
                        prev.map(msg => 
                            msg._id === tempId ? { ...data.chat, isTemp: false } : msg
                        )
                    );
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove temp message if failed
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
        }
    };

    const formatTime = (date) => {
        const d = new Date(date);
        return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    };

    if (!user) return null;

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
                        title="Chat với đối tác"
                    >
                        <FiUsers size={24} />
                        <span className="button-label">Chat Partner</span>
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
                                        title="Quay lại danh sách"
                                    >
                                        ←
                                    </button>
                                )}
                                <FiUsers size={20} />
                                <h4>
                                    {showPartnerList 
                                        ? 'Chọn Partner' 
                                        : selectedPartner?.name || selectedPartner?.businessName || 'Partner'}
                                </h4>
                            </div>
                            <div className="header-actions">
                                <button onClick={handleMinimize} title={isMinimized ? "Mở rộng" : "Thu nhỏ"}>
                                    {isMinimized ? <FiMaximize2 size={18} /> : <FiMinus size={18} />}
                                </button>
                                <button onClick={handleClose} title="Đóng">
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
                                        {loading ? (
                                            <div className="loading-state">
                                                <div className="spinner"></div>
                                                <p>Đang tải danh sách...</p>
                                            </div>
                                        ) : partners.length === 0 ? (
                                            <div className="empty-state">
                                                <FiUsers size={48} />
                                                <p>Chưa có partner nào</p>
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
                                                            {partner.name?.charAt(0) || partner.businessName?.charAt(0) || 'P'}
                                                        </div>
                                                        <div className="partner-info">
                                                            <h5>{partner.name || partner.businessName || 'Partner'}</h5>
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
                                                    <p>Bắt đầu cuộc trò chuyện</p>
                                                </div>
                                            ) : (
                                                messages.map((msg) => {
                                                    const userId = user._id || user.id;
                                                    return (
                                                    <motion.div
                                                        key={msg._id}
                                                        className={`message ${msg.senderId === userId ? 'sent' : 'received'} ${msg.isTemp ? 'temp' : ''}`}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                    >
                                                        <div className="message-content">
                                                            {msg.message}
                                                        </div>
                                                        <div className="message-time">
                                                            {formatTime(msg.createdAt)}
                                                            {msg.isTemp && ' • Đang gửi...'}
                                                        </div>
                                                    </motion.div>
                                                    );
                                                })
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input Form */}
                                        <form className="message-input-form" onSubmit={handleSendMessage}>
                                            <input
                                                type="text"
                                                className="message-input"
                                                placeholder="Nhập tin nhắn..."
                                                value={messageInput}
                                                onChange={(e) => setMessageInput(e.target.value)}
                                            />
                                            <button
                                                type="submit"
                                                className="send-button"
                                                disabled={!messageInput.trim()}
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

export default PartnerChatWidget;
