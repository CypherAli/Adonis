import React, { useState, useEffect, useRef, useContext, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    FiMessageCircle, FiX, FiSend, FiMinimize2, FiUser, FiClock 
} from 'react-icons/fi';
import AuthContext from '../../context/AuthContext';
import io from 'socket.io-client';
import './PartnerLiveChat.css';

/**
 * Partner LiveChat Widget
 * Partner nhận tin nhắn từ customers
 * Hiển thị danh sách customers đang chat
 */
const PartnerLiveChat = () => {
    const { user } = useContext(AuthContext);
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [socket, setSocket] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [unreadCounts, setUnreadCounts] = useState({});
    const messagesEndRef = useRef(null);

    // Get partner ID safely
    const partnerId = user?._id || user?.id;

    // Define loadCustomers as useCallback to stabilize reference
    const loadCustomers = useCallback(async () => {
        // Check if partnerId is valid
        if (!partnerId) {
            console.log('⚠️ Cannot load customers: partnerId is undefined');
            console.log('   User object:', user);
            return;
        }

        console.log('📋 Loading customers for partner:', partnerId);

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            
            const response = await fetch(
                `${apiUrl}/chat/partner/${partnerId}/customers`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            
            console.log('📥 Customers response:', data);
            
            if (data.success && data.customers) {
                setCustomers(data.customers);
                console.log('✅ Loaded', data.customers.length, 'customers');
            }
        } catch (error) {
            console.error('❌ Error loading customers:', error);
        }
    }, [partnerId, user]);

    useEffect(() => {
        // Check if partner is logged in and has valid ID
        if (!user || !partnerId) {
            console.log('⚠️ PartnerLiveChat: Partner not logged in or ID not available');
            console.log('   User:', user);
            console.log('   Partner ID:', partnerId);
            return;
        }

        console.log('🔌 PartnerLiveChat: Initializing socket for partner:', partnerId);

        // Initialize Socket.IO
        const newSocket = io(process.env.REACT_APP_SERVER_URL || 'http://localhost:5000', {
            transports: ['polling', 'websocket'],
            reconnection: true,
        });
        
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('✅ Partner connected to chat');
            console.log('   Partner ID:', partnerId);
            console.log('   Emitting partner:join...');
            setIsConnected(true);
            // Join as partner - this registers the partner to receive messages
            newSocket.emit('partner:join', partnerId);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Partner disconnected');
            setIsConnected(false);
        });

        // Receive new message (new conversation system)
        newSocket.on('message:received', (message) => {
            console.log('📩 Partner received message:', message);
            
            // If currently viewing this conversation, add message
            if (selectedCustomer && selectedCustomer.conversationId === message.conversation) {
                setMessages(prev => {
                    // Check for duplicates by ID or temp ID
                    const exists = prev.some(m => 
                        m._id === message._id ||
                        (m.isTemp && m.message === message.message)
                    );
                    
                    if (exists) {
                        console.log('⚠️ Duplicate message detected, replacing temp with real');
                        // Replace temp message with real one
                        return prev.map(m => 
                            (m.isTemp && m.message === message.message) ? { ...message, isTemp: false } : m
                        );
                    }
                    
                    console.log('✅ Adding new message');
                    return [...prev, message];
                });
            }
        });
        
        // Receive notification of new message in other conversations
        newSocket.on('notification:new_message', ({ conversationId, message }) => {
            console.log('🔔 New message notification for conversation:', conversationId);
            
            // Reload customer list to update last message and unread counts
            loadCustomers();
        });

        return () => {
            newSocket.disconnect();
        };
    }, [partnerId, selectedCustomer, user, loadCustomers]); // Add loadCustomers dependency

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) {
            loadCustomers();
        }
    }, [isOpen, loadCustomers]);

    const loadChatHistory = async (customer) => {
        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            
            // Load messages from conversation
            const response = await fetch(
                `${apiUrl}/chat/conversations/${customer.conversationId}/messages`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            const data = await response.json();
            
            if (data.success && data.messages) {
                setMessages(data.messages);
                // Reset unread count for this customer
                setUnreadCounts(prev => {
                    const newCounts = { ...prev };
                    delete newCounts[customer.customerId];
                    return newCounts;
                });
            }
        } catch (error) {
            console.error('Error loading chat:', error);
        }
    };

    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        loadChatHistory(customer);
        
        // Join conversation room via socket
        if (socket?.connected && customer.conversationId) {
            socket.emit('conversation:join', customer.conversationId);
        }
    };

    const handleBackToList = () => {
        setSelectedCustomer(null);
        setMessages([]);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedCustomer) return;

        const tempId = `temp_${Date.now()}`;
        const messageData = {
            _id: tempId,
            message: newMessage.trim(),
            senderRole: 'partner',
            sender: { 
                username: user?.shopName || user?.name || 'Partner',
                _id: partnerId 
            },
            createdAt: new Date(),
            isTemp: true
        };

        setMessages(prev => [...prev, messageData]);
        const messageCopy = newMessage.trim();
        setNewMessage('');

        try {
            const token = localStorage.getItem('token');
            const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
            
            // Send via new conversation API
            const response = await fetch(
                `${apiUrl}/chat/conversations/${selectedCustomer.conversationId}/messages`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ message: messageCopy })
                }
            );
            
            const data = await response.json();
            
            if (data.success) {
                console.log('✅ Partner message sent successfully');
                // Replace temp message with real one
                setMessages(prev => 
                    prev.map(msg => 
                        msg._id === tempId ? { ...data.message, isTemp: false } : msg
                    )
                );
                
                // Emit via socket for real-time delivery to other participants
                if (socket?.connected) {
                    socket.emit('message:send', {
                        conversationId: selectedCustomer.conversationId,
                        messageId: data.message._id
                    });
                }
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Remove temp message on error
            setMessages(prev => prev.filter(msg => msg._id !== tempId));
            alert('Không thể gửi tin nhắn. Vui lòng thử lại.');
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

    const getTotalUnread = () => {
        return Object.values(unreadCounts).reduce((sum, count) => sum + count, 0);
    };

    return (
        <>
            {/* Chat Button */}
            <motion.button
                className="partner-chat-toggle-btn"
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
            >
                <FiMessageCircle size={24} />
                {getTotalUnread() > 0 && (
                    <span className="unread-badge">{getTotalUnread()}</span>
                )}
                {!isOpen && <span className="chat-label">Chat Customers</span>}
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div 
                        className={`partner-chat-window ${isMinimized ? 'minimized' : ''}`}
                        initial={{ opacity: 0, y: 50, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.8 }}
                    >
                        {/* Header */}
                        <div className="partner-chat-header">
                            <div className="header-info">
                                {selectedCustomer && (
                                    <button 
                                        className="back-btn"
                                        onClick={handleBackToList}
                                    >
                                        ←
                                    </button>
                                )}
                                <FiMessageCircle className="header-icon" />
                                <div>
                                    <h4>
                                        {selectedCustomer 
                                            ? `${selectedCustomer.customerName}${selectedCustomer.isAnonymous ? ' (Guest)' : ''}`
                                            : `Customers (${customers.length})`}
                                    </h4>
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

                        {/* Content */}
                        {!isMinimized && (
                            <>
                                {!selectedCustomer ? (
                                    /* Customer List */
                                    <div className="customer-list">
                                        {customers.length === 0 ? (
                                            <div className="no-customers">
                                                <FiUser size={48} />
                                                <p>Chưa có khách hàng nào chat</p>
                                            </div>
                                        ) : (
                                            customers.map(customer => (
                                                <motion.div
                                                    key={customer.conversationId}
                                                    className="customer-item"
                                                    onClick={() => handleSelectCustomer(customer)}
                                                    whileHover={{ scale: 1.02 }}
                                                >
                                                    <div className="customer-avatar">
                                                        {customer.isAnonymous && '👤'}
                                                        {!customer.isAnonymous && (customer.customerName?.charAt(0) || 'C')}
                                                    </div>
                                                    <div className="customer-info">
                                                        <h5>
                                                            {customer.customerName || 'Khách hàng'}
                                                            {customer.isAnonymous && ' (Guest)'}
                                                        </h5>
                                                        <p>{customer.lastMessage?.text || 'Bắt đầu chat...'}</p>
                                                    </div>
                                                    {customer.unreadCount > 0 && (
                                                        <span className="customer-unread">
                                                            {customer.unreadCount}
                                                        </span>
                                                    )}
                                                </motion.div>
                                            ))
                                        )}
                                    </div>
                                ) : (
                                    /* Chat Messages */
                                    <>
                                        <div className="chat-messages">
                                            {messages.length === 0 ? (
                                                <div className="no-messages">
                                                    <FiMessageCircle size={48} />
                                                    <p>Chưa có tin nhắn</p>
                                                </div>
                                            ) : (
                                                messages.map(msg => {
                                                    const isPartnerMessage = msg.senderRole === 'partner' || 
                                                                           (msg.sender && msg.sender._id === partnerId);
                                                    return (
                                                        <motion.div
                                                            key={msg._id}
                                                            className={`message ${isPartnerMessage ? 'partner' : 'customer'}`}
                                                            initial={{ opacity: 0, y: 10 }}
                                                            animate={{ opacity: 1, y: 0 }}
                                                        >
                                                            <div className="message-sender">
                                                                {isPartnerMessage 
                                                                    ? (msg.sender?.username || user?.shopName || 'Shop')
                                                                    : (msg.anonymousName || msg.sender?.username || 'Khách')}
                                                            </div>
                                                            <div className="message-content">
                                                                <p>{msg.message}</p>
                                                                <span className="message-time">
                                                                    <FiClock size={12} /> {formatTime(msg.createdAt)}
                                                                    {msg.isTemp && ' • Đang gửi...'}
                                                                </span>
                                                            </div>
                                                        </motion.div>
                                                    );
                                                })
                                            )}
                                            <div ref={messagesEndRef} />
                                        </div>

                                        {/* Input */}
                                        <div className="chat-input">
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
                                    </>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default PartnerLiveChat;
