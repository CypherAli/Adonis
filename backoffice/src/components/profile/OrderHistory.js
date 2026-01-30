import React, { useState } from 'react'
import axios from '../../api/axiosConfig'
import { useToast } from '../common/Toast'
import { useNavigate } from 'react-router-dom'
import {
  FiPackage,
  FiClock,
  FiTruck,
  FiCheck,
  FiX,
  FiMapPin,
  FiCalendar,
  FiDollarSign,
} from 'react-icons/fi'
import './ProfileTabs.css'

const OrderHistory = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFilter, setActiveFilter] = useState('all')
  const toast = useToast()
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/orders/my-orders')
      console.log('📦 Fetched orders:', response.data)

      // Handle both old and new API response format
      const ordersData = response.data.orders || response.data
      setOrders(Array.isArray(ordersData) ? ordersData : [])
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Cannot load orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  // Load orders on mount
  React.useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return
    }

    try {
      await axios.put(`/orders/${orderId}/cancel`)
      toast.success('Order cancelled')
      fetchOrders() // Refresh orders
    } catch (error) {
      toast.error(error.response?.data?.message || 'Cannot cancel order')
    }
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: {
        label: 'Chờ xác nhận',
        icon: <FiClock />,
        color: '#ffa726',
      },
      processing: {
        label: 'Đang xử lý',
        icon: <FiPackage />,
        color: '#29b6f6',
      },
      shipped: {
        label: 'Đang giao',
        icon: <FiTruck />,
        color: '#66bb6a',
      },
      delivered: {
        label: 'Đã giao',
        icon: <FiCheck />,
        color: '#4caf50',
      },
      cancelled: {
        label: 'Đã hủy',
        icon: <FiX />,
        color: '#ef5350',
      },
    }
    return statusMap[status] || statusMap.pending
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price)
  }

  const filteredOrders =
    activeFilter === 'all' ? orders : orders.filter((order) => order.status === activeFilter)

  if (loading) {
    return (
      <div className="order-history-loading">
        <div className="spinner"></div>
        <p>Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="order-history-tab">
      <div className="order-header">
        <h2>
          <FiPackage /> My Orders
        </h2>
        <p className="orders-count">Total {orders.length} orders</p>
      </div>

      {/* Filter Tabs */}
      <div className="order-filters">
        <button
          className={`filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All ({orders.length})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveFilter('pending')}
        >
          Chờ xác nhận ({orders.filter((o) => o.status === 'pending').length})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'processing' ? 'active' : ''}`}
          onClick={() => setActiveFilter('processing')}
        >
          Đang xử lý ({orders.filter((o) => o.status === 'processing').length})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'shipped' ? 'active' : ''}`}
          onClick={() => setActiveFilter('shipped')}
        >
          Đang giao ({orders.filter((o) => o.status === 'shipped').length})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'delivered' ? 'active' : ''}`}
          onClick={() => setActiveFilter('delivered')}
        >
          Đã giao ({orders.filter((o) => o.status === 'delivered').length})
        </button>
        <button
          className={`filter-btn ${activeFilter === 'cancelled' ? 'active' : ''}`}
          onClick={() => setActiveFilter('cancelled')}
        >
          Đã hủy ({orders.filter((o) => o.status === 'cancelled').length})
        </button>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="no-orders">
          <FiPackage size={64} />
          <h3>No orders yet</h3>
          <p>
            {activeFilter === 'all'
              ? "You don't have any orders. Start shopping!"
              : `No ${getStatusInfo(activeFilter).label.toLowerCase()} orders`}
          </p>
          <button className="btn-shop-now" onClick={() => navigate('/')}>
            Mua sắm ngay
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {filteredOrders.map((order) => {
            const statusInfo = getStatusInfo(order.status)
            return (
              <div key={order._id} className="order-card">
                <div className="order-card-header">
                  <div className="order-id-section">
                    <span className="order-label">Order Code:</span>
                    <span className="order-id">
                      #{order.orderNumber || order._id.slice(-8).toUpperCase()}
                    </span>
                    {order.paymentMethod && (
                      <span className="payment-method-badge">
                        💳{' '}
                        {order.paymentMethod === 'cod'
                          ? 'COD'
                          : order.paymentMethod === 'bank'
                            ? 'Ngân hàng'
                            : order.paymentMethod === 'momo'
                              ? 'MoMo'
                              : order.paymentMethod === 'zalopay'
                                ? 'ZaloPay'
                                : order.paymentMethod}
                      </span>
                    )}
                  </div>
                  <div className="status-section">
                    <div
                      className="order-status-badge"
                      style={{ backgroundColor: statusInfo.color }}
                    >
                      {statusInfo.icon}
                      <span>{statusInfo.label}</span>
                    </div>
                    {order.paymentStatus && (
                      <span className={`payment-status ${order.paymentStatus}`}>
                        {order.paymentStatus === 'paid'
                          ? '✅ Paid'
                          : order.paymentStatus === 'unpaid'
                            ? '⏳ Unpaid'
                            : order.paymentStatus}
                      </span>
                    )}
                  </div>
                </div>

                <div className="order-card-body">
                  {/* Order Items */}
                  <div className="order-items">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-image">
                          {item.imageUrl ? (
                            <img src={item.imageUrl} alt={item.name} />
                          ) : (
                            <div className="item-placeholder">
                              <FiPackage />
                            </div>
                          )}
                        </div>
                        <div className="item-info">
                          <h4>{item.name}</h4>
                          <p className="item-quantity">Số lượng: {item.quantity}</p>
                          <p className="item-price">{formatPrice(item.price)}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Details */}
                  <div className="order-details">
                    <div className="detail-row">
                      <FiCalendar />
                      <span>Ngày đặt: {formatDate(order.createdAt)}</span>
                    </div>
                    {order.shippingAddress && (
                      <div className="detail-row">
                        <FiMapPin />
                        <span>
                          {order.shippingAddress.fullName} - {order.shippingAddress.phone}
                        </span>
                      </div>
                    )}
                    <div className="detail-row price-breakdown">
                      {order.subtotal && (
                        <span className="price-item">Tiền hàng: {formatPrice(order.subtotal)}</span>
                      )}
                      {order.shippingFee !== undefined && (
                        <span className="price-item">
                          Phí ship:{' '}
                          {order.shippingFee === 0 ? 'Miễn phí' : formatPrice(order.shippingFee)}
                        </span>
                      )}
                      {order.discount > 0 && (
                        <span className="price-item discount">
                          Giảm: -{formatPrice(order.discount)}
                        </span>
                      )}
                    </div>
                    <div className="detail-row">
                      <FiDollarSign />
                      <span className="total-amount">
                        Tổng cộng: {formatPrice(order.totalAmount)}
                      </span>
                    </div>
                    {order.customerNotes && (
                      <div className="detail-row notes">
                        <span>📝 Ghi chú: {order.customerNotes}</span>
                      </div>
                    )}
                    {order.tracking?.trackingNumber && (
                      <div className="detail-row tracking">
                        <FiTruck />
                        <span>Mã vận đơn: {order.tracking.trackingNumber}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="order-card-footer">
                  <button
                    className="btn-view-detail"
                    onClick={() => navigate(`/orders/${order._id}`)}
                  >
                    Chi tiết
                  </button>
                  {order.status === 'pending' && (
                    <button
                      className="btn-cancel-order"
                      onClick={() => handleCancelOrder(order._id)}
                    >
                      Hủy đơn
                    </button>
                  )}
                  {order.status === 'delivered' && (
                    <button className="btn-buy-again">Mua lại</button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default OrderHistory
