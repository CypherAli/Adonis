'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import {
  FiBell,
  FiCheck,
  FiTrash2,
  FiPackage,
  FiShield,
  FiGift,
  FiAlertCircle,
} from 'react-icons/fi'
import '../ProfileTabs.css'

interface Notification {
  _id: string
  type: string
  title: string
  message: string
  status: string
  priority?: string
  createdAt: string
  actionUrl?: string
  relatedOrder?: string
  relatedProduct?: string
}

interface NotificationCenterProps {
  onCountChange?: (count: number) => void
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ onCountChange }) => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [filter])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const params = filter !== 'all' ? { status: filter } : {}
      const response = await api.get('/api/notifications/my-notifications', { params })

      const notifData = response.data.notifications || response.data
      setNotifications(Array.isArray(notifData) ? notifData : [])

      if (response.data.unreadCount !== undefined && onCountChange) {
        onCountChange(response.data.unreadCount)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
      alert('Cannot load notifications')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await api.post(`/api/notifications/${notificationId}/read`)
      fetchNotifications()
      alert('Đã đánh dấu đã đọc')
    } catch (error) {
      alert('Không thể đánh dấu đã đọc')
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await api.post('/api/notifications/mark-all-read')
      fetchNotifications()
      alert('Marked all as read')
    } catch (error) {
      alert('Failed to mark all')
    }
  }

  const handleDelete = async (notificationId: string) => {
    if (!window.confirm('Are you sure you want to delete this notification?')) {
      return
    }

    try {
      await api.delete(`/api/notifications/${notificationId}`)
      fetchNotifications()
      alert('Notification deleted')
    } catch (error) {
      alert('Không thể xóa thông báo')
    }
  }

  const handleDeleteAllRead = async () => {
    if (!window.confirm('Are you sure you want to delete all read notifications?')) {
      return
    }

    try {
      await api.delete('/api/notifications/read')
      fetchNotifications()
      alert('Deleted all read notifications')
    } catch (error) {
      alert('Không thể xóa thông báo')
    }
  }

  const handleNotificationClick = async (notification: Notification) => {
    if (notification.status === 'unread') {
      await handleMarkAsRead(notification._id)
    }

    if (notification.actionUrl) {
      router.push(notification.actionUrl)
    } else if (notification.relatedOrder) {
      router.push(`/orders/${notification.relatedOrder}`)
    } else if (notification.relatedProduct) {
      router.push(`/product/${notification.relatedProduct}`)
    }
  }

  const getNotificationIcon = (type: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      order_confirmed: <FiPackage />,
      order_shipped: <FiPackage />,
      order_delivered: <FiPackage />,
      order_cancelled: <FiPackage />,
      price_drop: <FiGift />,
      back_in_stock: <FiGift />,
      warranty_expiring: <FiShield />,
      warranty_expired: <FiShield />,
      voucher_received: <FiGift />,
      voucher_expiring: <FiGift />,
      system_announcement: <FiBell />,
      new_promotion: <FiGift />,
    }
    return iconMap[type] || <FiBell />
  }

  const getNotificationColor = (type: string) => {
    if (type.includes('order')) return '#3498db'
    if (type.includes('warranty')) return '#e67e22'
    if (type.includes('voucher') || type.includes('price') || type.includes('promotion'))
      return '#27ae60'
    return '#95a5a6'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Vừa xong'
    if (diffMins < 60) return `${diffMins} phút trước`
    if (diffHours < 24) return `${diffHours} giờ trước`
    if (diffDays < 7) return `${diffDays} ngày trước`
    return date.toLocaleDateString('vi-VN')
  }

  const unreadCount = notifications.filter((n) => n.status === 'unread').length

  if (loading) {
    return (
      <div className="notification-loading">
        <div className="spinner"></div>
        <p>Loading notifications...</p>
      </div>
    )
  }

  return (
    <div className="notification-center-tab">
      <div className="notification-header">
        <h2>
          <FiBell /> Thông báo
        </h2>
        <div className="notification-actions">
          {unreadCount > 0 && (
            <button className="btn-mark-all-read" onClick={handleMarkAllAsRead}>
              <FiCheck /> Mark all as read
            </button>
          )}
          <button className="btn-delete-read" onClick={handleDeleteAllRead}>
            <FiTrash2 /> Xóa đã đọc
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="notification-filters">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </button>
        <button
          className={`filter-btn ${filter === 'unread' ? 'active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Chưa đọc ({unreadCount})
        </button>
        <button
          className={`filter-btn ${filter === 'read' ? 'active' : ''}`}
          onClick={() => setFilter('read')}
        >
          Đã đọc ({notifications.filter((n) => n.status === 'read').length})
        </button>
      </div>

      {/* Notifications List */}
      {notifications.length === 0 ? (
        <div className="no-notifications">
          <FiBell size={64} />
          <h3>Không có thông báo</h3>
          <p>
            {filter === 'all'
              ? 'Bạn chưa có thông báo nào'
              : filter === 'unread'
                ? 'Bạn không có thông báo chưa đọc'
                : 'Bạn không có thông báo đã đọc'}
          </p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => {
            const icon = getNotificationIcon(notification.type)
            const color = getNotificationColor(notification.type)

            return (
              <div
                key={notification._id}
                className={`notification-item ${notification.status === 'unread' ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(notification)}
              >
                <div className="notification-icon" style={{ backgroundColor: color }}>
                  {icon}
                </div>

                <div className="notification-content">
                  <div className="notification-title-row">
                    <h4>{notification.title}</h4>
                    {notification.status === 'unread' && <span className="unread-badge">●</span>}
                  </div>
                  <p className="notification-message">{notification.message}</p>
                  <div className="notification-meta">
                    <span className="notification-time">{formatDate(notification.createdAt)}</span>
                    {notification.priority === 'high' && (
                      <span className="priority-badge high">
                        <FiAlertCircle /> Quan trọng
                      </span>
                    )}
                    {notification.priority === 'urgent' && (
                      <span className="priority-badge urgent">
                        <FiAlertCircle /> Khẩn cấp
                      </span>
                    )}
                  </div>
                </div>

                <div className="notification-actions-btn">
                  {notification.status === 'unread' && (
                    <button
                      className="btn-icon"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkAsRead(notification._id)
                      }}
                      title="Đánh dấu đã đọc"
                    >
                      <FiCheck />
                    </button>
                  )}
                  <button
                    className="btn-icon delete"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification._id)
                    }}
                    title="Xóa"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Notification Settings */}
      <div className="notification-settings">
        <h3>Cài đặt thông báo</h3>
        <div className="settings-options">
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Order notifications</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Thông báo khuyến mãi</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Thông báo bảo hành</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" defaultChecked />
            <span>Thông báo giá giảm</span>
          </label>
          <label className="setting-item">
            <input type="checkbox" />
            <span>Nhận thông báo qua email</span>
          </label>
        </div>
      </div>
    </div>
  )
}

export default NotificationCenter
