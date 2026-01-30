import React, { useState, useRef, useEffect } from 'react'
import { FiMessageCircle, FiX, FiSend, FiUser } from 'react-icons/fi'
import './ChatBox.css'

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! I am the virtual assistant of Laptop Store. How can I help you?',
      sender: 'bot',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickReplies = [
    'Product Consultation',
    'Warranty Policy',
    'Shopping Guide',
    'Contact Advisor',
  ]

  const autoReply = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase()

    if (lowerMessage.includes('product') || lowerMessage.includes('consultation')) {
      return 'We have many laptop models suitable for your needs. What purpose do you need a laptop for? (Gaming, Office, Graphics...)'
    } else if (lowerMessage.includes('warranty')) {
      return 'All products in our store have official warranty for 12-36 months. Which product do you need specific information about?'
    } else if (lowerMessage.includes('shopping') || lowerMessage.includes('order')) {
      return 'You can order directly on the website, or contact hotline: 084.686.5650 for fastest support!'
    } else if (lowerMessage.includes('price') || lowerMessage.includes('deal')) {
      return 'We have many attractive promotions! Please check the "Hot Deals" section for details.'
    } else if (lowerMessage.includes('contact') || lowerMessage.includes('phone')) {
      return 'You can contact us:\n📞 Hotline: 084.686.5650\n📧 Email: trinhviethoangawm@gmail.com\n📍 Address: Hanoi, Vietnam'
    } else if (lowerMessage.includes('address') || lowerMessage.includes('location')) {
      return 'Our store is located in Hanoi. Contact hotline 084.686.5650 to know the nearest address!'
    } else {
      return 'Thank you for contacting us! For more detailed consultation, please contact:\n📞 Hotline: 084.686.5650\n📧 Email: trinhviethoangawm@gmail.com'
    }
  }

  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputMessage,
        sender: 'user',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages([...messages, newMessage])
      setInputMessage('')

      // Auto reply after 1 second
      setTimeout(() => {
        const botReply = {
          id: messages.length + 2,
          text: autoReply(inputMessage),
          sender: 'bot',
          time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        }
        setMessages((prev) => [...prev, botReply])
      }, 1000)
    }
  }

  const handleQuickReply = (reply) => {
    const newMessage = {
      id: messages.length + 1,
      text: reply,
      sender: 'user',
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages([...messages, newMessage])

    setTimeout(() => {
      const botReply = {
        id: messages.length + 2,
        text: autoReply(reply),
        sender: 'bot',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages((prev) => [...prev, botReply])
    }, 1000)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      <button
        className={`chat-button ${isOpen ? 'hidden' : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Open chat"
      >
        <FiMessageCircle />
        <span className="chat-badge">Support</span>
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="chat-box">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-content">
              <div className="chat-avatar">
                <FiUser />
              </div>
              <div className="chat-header-text">
                <h3>Customer Support</h3>
                <p className="chat-status">
                  <span className="status-dot"></span>
                  Online
                </p>
              </div>
            </div>
            <button
              className="chat-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              <FiX />
            </button>
          </div>

          {/* Messages */}
          <div className="chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`message ${message.sender === 'user' ? 'message-user' : 'message-bot'}`}
              >
                <div className="message-content">
                  <p className="message-text">{message.text}</p>
                  <span className="message-time">{message.time}</span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 3 && (
            <div className="quick-replies">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  className="quick-reply-btn"
                  onClick={() => handleQuickReply(reply)}
                >
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="chat-send-btn"
              onClick={handleSendMessage}
              disabled={!inputMessage.trim()}
              aria-label="Send message"
            >
              <FiSend />
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default ChatBox
