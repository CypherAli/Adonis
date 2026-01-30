import React, { useState, useEffect, useRef, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend, FiUser, FiMinus } from 'react-icons/fi'
import ChatContext from '../../context/ChatContext'
import AuthContext from '../../context/AuthContext'
import './ChatWidget.css'

const ChatWidget = () => {
  const { user } = useContext(AuthContext)
  const {
    activeConversation,
    messages,
    unreadCount,
    typingUsers,
    loading,
    createConversation,
    sendMessage,
    sendTyping,
  } = useContext(ChatContext)

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messageInput, setMessageInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const typingTimeoutRef = useRef(null)

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Open chat and create conversation with admin
  const handleOpenChat = async () => {
    setIsOpen(true)
    setIsMinimized(false)

    if (!activeConversation) {
      try {
        // Fetch admin ID from server - FIX URL
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000/api'
        const response = await fetch(`${apiUrl}/user/get-admin`)
        const data = await response.json()

        if (data.success && data.adminId) {
          await createConversation(data.adminId, 'Customer Support')
        }
      } catch (error) {
        console.error('Error fetching admin:', error)
      }
    }
  }

  const handleClose = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()

    if (!messageInput.trim() || !activeConversation) return

    await sendMessage(activeConversation._id, messageInput)
    setMessageInput('')
    setIsTyping(false)

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    sendTyping(activeConversation._id, false)
  }

  const handleInputChange = (e) => {
    setMessageInput(e.target.value)

    if (!activeConversation) return

    // Send typing indicator
    if (!isTyping) {
      setIsTyping(true)
      sendTyping(activeConversation._id, true)
    }

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current)
    }

    // Stop typing after 3 seconds
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false)
      sendTyping(activeConversation._id, false)
    }, 3000)
  }

  const formatTime = (date) => {
    const d = new Date(date)
    return d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
  }

  const getTypingText = () => {
    const typingArray = Array.from(typingUsers)
    if (typingArray.length === 0) return null

    const usernames = typingArray.map((item) => item.split(':')[1])
    return `${usernames.join(', ')} đang nhập...`
  }

  if (!user) return null

  return (
    <>
      {/* Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="chat-widget-button"
            onClick={handleOpenChat}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <FiMessageCircle size={24} />
            {unreadCount > 0 && (
              <motion.span className="chat-badge" initial={{ scale: 0 }} animate={{ scale: 1 }}>
                {unreadCount}
              </motion.span>
            )}
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className={`chat-widget-container ${isMinimized ? 'minimized' : ''}`}
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="chat-widget-header">
              <div className="chat-widget-header-info">
                <div className="chat-avatar">
                  <FiUser />
                </div>
                <div>
                  <h4>{activeConversation?.title || 'Chat với Partner'}</h4>
                  <span className="online-status">
                    <span className="status-dot"></span>
                    Đang hoạt động
                  </span>
                </div>
              </div>
              <div className="chat-widget-actions">
                <button
                  className="chat-action-btn"
                  onClick={handleMinimize}
                  title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
                >
                  <FiMinus />
                </button>
                <button className="chat-action-btn" onClick={handleClose} title="Đóng">
                  <FiX />
                </button>
              </div>
            </div>

            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="chat-widget-messages">
                  {loading ? (
                    <div className="chat-loading">
                      <div className="spinner"></div>
                      <p>Đang tải tin nhắn...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="chat-empty">
                      <FiMessageCircle size={48} />
                      <p>Chưa có tin nhắn</p>
                      <small>Hãy bắt đầu cuộc trò chuyện!</small>
                    </div>
                  ) : (
                    <AnimatePresence>
                      {messages.map((msg, index) => {
                        const isOwnMessage = msg.sender._id === user.id
                        const showAvatar =
                          index === 0 || messages[index - 1].sender._id !== msg.sender._id

                        return (
                          <motion.div
                            key={msg._id}
                            className={`chat-message ${isOwnMessage ? 'own' : 'other'}`}
                            initial={{ opacity: 0, x: isOwnMessage ? 20 : -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            {!isOwnMessage && showAvatar && (
                              <div className="message-avatar">
                                {msg.sender.avatar ? (
                                  <img src={msg.sender.avatar} alt={msg.sender.username} />
                                ) : (
                                  <FiUser />
                                )}
                              </div>
                            )}
                            <div className="message-bubble">
                              {!isOwnMessage && showAvatar && (
                                <span className="message-sender">{msg.sender.username}</span>
                              )}
                              <p className="message-text">{msg.message}</p>
                              <span className="message-time">{formatTime(msg.createdAt)}</span>
                            </div>
                          </motion.div>
                        )
                      })}
                    </AnimatePresence>
                  )}
                  <div ref={messagesEndRef} />

                  {/* Typing Indicator */}
                  {getTypingText() && (
                    <motion.div
                      className="typing-indicator"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <span className="typing-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                      </span>
                      <span className="typing-text">{getTypingText()}</span>
                    </motion.div>
                  )}
                </div>

                {/* Input */}
                <form className="chat-widget-input" onSubmit={handleSendMessage}>
                  <input
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={messageInput}
                    onChange={handleInputChange}
                    disabled={!activeConversation}
                  />
                  <button
                    type="submit"
                    disabled={!messageInput.trim() || !activeConversation}
                    className="chat-send-btn"
                  >
                    <FiSend />
                  </button>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ChatWidget
