import React, { useState, useEffect, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi'
import AuthContext from '../../context/AuthContext'
import './LiveChatBox.css'

const LiveChatBox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const { user } = useContext(AuthContext)

  // Load chat history from localStorage
  useEffect(() => {
    const savedMessages = localStorage.getItem('chatMessages')
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages))
    } else {
      // Welcome message
      setMessages([
        {
          id: 1,
          sender: 'support',
          text: 'Xin chào! Chúng tôi có thể giúp gì cho bạn?',
          timestamp: new Date().toISOString(),
        },
      ])
    }
  }, [])

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages))
    }
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (message.trim()) {
      const newMessage = {
        id: Date.now(),
        sender: 'user',
        text: message,
        timestamp: new Date().toISOString(),
        userName: user?.name || 'Khách',
      }

      setMessages((prev) => [...prev, newMessage])
      setMessage('')

      // Auto-reply simulation
      setTimeout(() => {
        const autoReply = {
          id: Date.now() + 1,
          sender: 'support',
          text: 'Thank you for contacting us! We will respond shortly. You can also call our hotline: 084.686.5650 for faster support.',
          timestamp: new Date().toISOString(),
        }
        setMessages((prev) => [...prev, autoReply])
      }, 1500)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.button
        className="chat-toggle-btn"
        onClick={toggleChat}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={isOpen ? { scale: 0 } : { scale: 1 }}
      >
        <FiMessageCircle />
        <span className="chat-notification-badge">1</span>
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="live-chat-container"
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Chat Header */}
            <div className="chat-header">
              <div className="chat-header-info">
                <div className="support-avatar">
                  <FiUser />
                </div>
                <div className="support-details">
                  <h4>Laptop Store Support</h4>
                  <span className="online-status">
                    <span className="status-dot"></span>
                    Đang hoạt động
                  </span>
                </div>
              </div>
              <button className="chat-close-btn" onClick={toggleChat}>
                <FiX />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="chat-messages">
              <AnimatePresence>
                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`chat-message ${msg.sender === 'user' ? 'user-message' : 'support-message'}`}
                    initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="message-bubble">
                      {msg.sender === 'support' && (
                        <div className="message-avatar">
                          <FiUser />
                        </div>
                      )}
                      <div className="message-content">
                        {msg.sender === 'user' && msg.userName && (
                          <span className="message-sender">{msg.userName}</span>
                        )}
                        <p>{msg.text}</p>
                        <span className="message-time">
                          {new Date(msg.timestamp).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Chat Input */}
            <form className="chat-input-form" onSubmit={handleSendMessage}>
              <input
                type="text"
                placeholder={user ? 'Type a message...' : 'Login to chat...'}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="chat-input"
                disabled={!user}
              />
              <motion.button
                type="submit"
                className="chat-send-btn"
                disabled={!message.trim() || !user}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <FiSend />
              </motion.button>
            </form>

            {!user && (
              <div className="chat-login-prompt">
                <p>
                  Please <a href="/login">login</a> to chat with us
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default LiveChatBox
