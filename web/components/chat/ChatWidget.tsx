'use client'

import { useEffect } from 'react'
import io, { Socket } from 'socket.io-client'
import { useState } from 'react'
import { useSession } from 'next-auth/react'

/**
 * Chat Widget - Client Component với Socket.io
 * Xử lý real-time chat
 * 
 * ⚠️ Important: Phải là 'use client' để tránh hydration errors
 */

let socket: Socket | null = null

export default function ChatWidget() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<any[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [connected, setConnected] = useState(false)

  // Initialize Socket.io connection
  useEffect(() => {
    if (!session) return

    const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3333'
    
    socket = io(WS_URL, {
      auth: {
        token: session.accessToken,
      },
    })

    socket.on('connect', () => {
      // console.log('✅ Socket connected')
      setConnected(true)
    })

    socket.on('disconnect', () => {
      // console.log('❌ Socket disconnected')
      setConnected(false)
    })

    socket.on('message', (message: any) => {
      setMessages((prev) => [...prev, message])
    })

    return () => {
      if (socket) {
        socket.disconnect()
        socket = null
      }
    }
  }, [session])

  const sendMessage = () => {
    if (!inputMessage.trim() || !socket) return

    socket.emit('message', {
      content: inputMessage,
      userId: session?.user?.id,
    })

    setInputMessage('')
  }

  if (!session) return null

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all z-50"
      >
        💬
      </button>

      {/* Chat Box */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 h-[500px] bg-white rounded-lg shadow-2xl z-50 flex flex-col">
          {/* Header */}
          <div className="bg-blue-600 text-white p-4 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${connected ? 'bg-green-400' : 'bg-red-400'}`} />
              <h3 className="font-semibold">Hỗ Trợ Trực Tuyến</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-xl">
              ×
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-center mt-8">
                Chào bạn! Chúng tôi có thể giúp gì cho bạn?
              </p>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.userId === session.user.id ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[70%] px-4 py-2 rounded-lg ${
                      msg.userId === session.user.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-800'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                placeholder="Nhập tin nhắn..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
