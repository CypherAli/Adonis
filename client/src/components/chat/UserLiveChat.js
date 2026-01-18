import React, { useState, useEffect, useRef, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMessageCircle, FiX, FiSend, FiMinimize2 } from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';
import './LiveChat.css';

/**
 * User LiveChat Widget - Chat trực tiếp với Support
 * Không cần tìm kiếm partner, user chat trực tiếp với support team
 */
const UserLiveChat = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);

    // User info
    const userId = user?._id || localStorage.getItem('chatUserId') || 
        (() => {
            const id = 'guest_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('chatUserId', id);
            return id;
        })();
    
    const userName = user?.name || 'Khách hàng';

    // Support partner ID (fixed)
    const SUPPORT_ID = 'support_team';

    useEffect(() => {
        // Initialize Socket.IO
        const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            transports: ['polling', 'websocket'],
            reconnection: true,
            reconnectionDelay: 1000,
            reconnectionAttempts: 5,
        });
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Connected to chat');
            setIsConnected(true);
            newSocket.emit('user:join', userId);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected');
            setIsConnected(false);
        });

        newSocket.on('chat:message', (message) => {
            // Only add if from support
            if (message.senderId === SUPPORT_ID || message.receiverId === SUPPORT_ID) {
                setMessages(prev => {
                    // Prevent duplicates
                    const exists = prev.some(m => m._id === message._id);
                    if (exists) return prev;
                    return [...prev, message];
                });
            }
        });

        return () => {
            newSocket.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        // Auto scroll
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Load chat history when opened
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            loadChatHistory();
        }
        // eslint-disable-next-line
    }, [isOpen]);

    const loadChatHistory = async () => {
        try {
            const response = await fetch(
                `http://localhost:5000/api/chat/history/${userId}/${SUPPORT_ID}`
            );
            const data = await response.json();
            
            if (data.success && data.messages) {
                setMessages(data.messages);
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        const tempId = `temp_${Date.now()}`;
        const messageData = {
            _id: tempId,
            senderId: userId,
            senderName: userName,
            receiverId: SUPPORT_ID,
            receiverName: 'Support Team',
            message: newMessage.trim(),
            timestamp: new Date(),
            senderType: 'user'
        };

        // Add to UI immediately
        setMessages(prev => [...prev, messageData]);
        setNewMessage('');

        try {
            // Send via socket
            if (socket?.connected) {
                socket.emit('chat:send', messageData);
            }

            // Send via API
            await fetch('http://localhost:5000/api/chat/send', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(messageData)
            });
        } catch (error) {
            console.error('Error sending:', error);
            // Remove message if failed
            setMessages(prev => prev.filter(m => m._id !== tempId));
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                className={`chat-toggle-btn ${isOpen ? 'active' : ''}`}
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                {isOpen ? <FiX /> : <FiMessageCircle />}
                {!isOpen && (
                    <span className="chat-notification">Support Chat</span>
                )}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={`chat-window ${isMinimized ? 'minimized' : ''}`}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    >
                        {/* Header */}
                        <div className="chat-header">
                            <div className="header-info">
                                <FiMessageCircle className="header-icon" />
                                <div>
                                    <h4>Support Team</h4>
                                    <span className="header-status">
                                        {isConnected ? '● Online' : '○ Offline'}
                                    </span>
                                </div>
                            </div>
                            <div className="header-actions">
                                <button onClick={() => setIsMinimized(!isMinimized)}>
                                    <FiMinimize2 />
                                </button>
                                <button onClick={() => setIsOpen(false)}>
                                    <FiX />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        {!isMinimized && (
                            <>
                                <div className="chat-messages">
                                    {messages.length === 0 ? (
                                        <div className="no-messages">
                                            <FiMessageCircle size={48} />
                                            <p>Chào mừng bạn!</p>
                                            <p>Hãy gửi tin nhắn để bắt đầu chat</p>
                                        </div>
                                    ) : (
                                        messages.map((msg) => (
                                            <motion.div
                                                key={msg._id}
                                                className={`message ${msg.senderId === userId ? 'user' : 'partner'}`}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                            >
                                                <div className="message-content">
                                                    <p>{msg.message}</p>
                                                    <span className="message-time">
                                                        {formatTime(msg.timestamp)}
                                                    </span>
                                                </div>
                                            </motion.div>
                                        ))
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                {/* Input */}
                                <div className="chat-input">
                                    <div className="input-group">
                                        <input
                                            type="text"
                                            placeholder="Nhập tin nhắn..."
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                        />
                                        <button
                                            className="send-btn"
                                            onClick={sendMessage}
                                            disabled={!newMessage.trim()}
                                        >
                                            <FiSend />
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UserLiveChat;
