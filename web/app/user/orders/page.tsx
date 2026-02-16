'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import api from '@/lib/api'
import { FiPackage, FiTruck, FiCheck, FiX, FiClock, FiStar } from 'react-icons/fi'
import ReviewModal from '@/components/modal/ReviewModal'

interface OrderItem {
  _id: string
  product?: string | { _id: string; images?: string[] }
  name: string
  imageUrl?: string
  price: number
  quantity: number
  hasReview?: boolean
}

interface ShippingAddress {
  fullName: string
  phone: string
  address: string | {
    street?: string
    ward?: string
    district?: string
    city?: string
  }
  city?: string
}

interface Order {
  _id: string
  orderNumber?: string
  items: OrderItem[]
  status: string
  createdAt: string
  totalAmount: number
  subtotal?: number
  shippingFee?: number
  discount?: number
  shippingAddress?: ShippingAddress
  paymentMethod?: string
  paymentStatus?: string
  tracking?: {
    trackingNumber?: string
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filterStatus, setFilterStatus] = useState('all')
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean
    productId: string
    productName: string
    productImage: string
    orderId: string
  }>({
    isOpen: false,
    productId: '',
    productName: '',
    productImage: '',
    orderId: '',
  })
  const { data: session, status: authStatus } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (authStatus === 'loading') return

    if (!session?.accessToken) {
      router.push('/auth/login')
      return
    }
    
    fetchOrders()
  }, [authStatus])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      setError(null)

      // Use optimized endpoint that returns orders with review status already joined
      const res = await api.get('/api/reviews/orders-with-status')
      const ordersData = Array.isArray(res.data) ? res.data : (res.data.orders || [])
      setOrders(ordersData)
    } catch (err: any) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        setOrders([])
        setError(null)
      } else {
        setError(err.response?.data?.message || 'Không thể tải danh sách đơn hàng')
        setOrders([])
      }
    } finally {
      setLoading(false)
    }
  }

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { label: string; color: string; bg: string; icon: any }> = {
      pending: { label: 'Chờ xử lý', color: 'text-yellow-700', bg: 'bg-yellow-100', icon: <FiClock /> },
      processing: { label: 'Đang xử lý', color: 'text-blue-700', bg: 'bg-blue-100', icon: <FiPackage /> },
      shipping: { label: 'Đang giao', color: 'text-purple-700', bg: 'bg-purple-100', icon: <FiTruck /> },
      delivered: { label: 'Đã giao', color: 'text-green-700', bg: 'bg-green-100', icon: <FiCheck /> },
      cancelled: { label: 'Đã hủy', color: 'text-red-700', bg: 'bg-red-100', icon: <FiX /> },
    }
    return configs[status.toLowerCase()] || configs.pending
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const openReviewModal = (item: OrderItem, orderId: string) => {
    const productId = typeof item.product === 'string' 
      ? item.product 
      : (item.product as any)?._id || ''
    const productImage = item.imageUrl || (item.product as any)?.images?.[0] || ''
    
    setReviewModal({
      isOpen: true,
      productId,
      productName: item.name,
      productImage,
      orderId,
    })
  }

  const closeReviewModal = () => {
    setReviewModal({
      isOpen: false,
      productId: '',
      productName: '',
      productImage: '',
      orderId: '',
    })
  }

  const handleReviewSuccess = () => {
    // Refresh orders to update review status
    fetchOrders()
  }

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status.toLowerCase() === filterStatus)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải đơn hàng...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Đơn hàng của tôi</h1>
          <p className="text-gray-600">Quản lý và theo dõi đơn hàng của bạn</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {[
              { id: 'all', label: 'Tất cả', count: orders.length },
              { id: 'pending', label: 'Chờ xử lý', count: orders.filter(o => o.status === 'pending').length },
              { id: 'processing', label: 'Đang xử lý', count: orders.filter(o => o.status === 'processing').length },
              { id: 'shipping', label: 'Đang giao', count: orders.filter(o => o.status === 'shipping').length },
              { id: 'delivered', label: 'Đã giao', count: orders.filter(o => o.status === 'delivered').length },
              { id: 'cancelled', label: 'Đã hủy', count: orders.filter(o => o.status === 'cancelled').length },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilterStatus(tab.id)}
                className={`flex-1 min-w-fit px-6 py-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                  filterStatus === tab.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="font-medium whitespace-nowrap">{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                    filterStatus === tab.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Orders List */}
        {error ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-600 font-medium">{error}</p>
            <button
              onClick={fetchOrders}
              className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
              <FiPackage className="text-4xl text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có đơn hàng</h3>
            <p className="text-gray-500 mb-6">
              {filterStatus === 'all' 
                ? 'Bạn chưa có đơn hàng nào' 
                : `Không có đơn hàng nào ${getStatusConfig(filterStatus).label.toLowerCase()}`}
            </p>
            <button
              onClick={() => router.push('/shop')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Khám phá sản phẩm
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => {
              const statusConfig = getStatusConfig(order.status)
              return (
                <div key={order._id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200">
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-sm font-medium text-gray-500">Mã đơn hàng:</span>
                          <span className="text-sm font-bold text-gray-900">
                            #{order.orderNumber || order._id.slice(-8)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">{formatDate(order.createdAt)}</p>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${statusConfig.bg}`}>
                        <span className={statusConfig.color}>{statusConfig.icon}</span>
                        <span className={`font-semibold ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item) => (
                        <div key={item._id} className="flex items-center gap-4">
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {(item.imageUrl || (item.product as any)?.images?.[0]) ? (
                              <Image
                                src={item.imageUrl || (item.product as any)?.images?.[0]}
                                alt={item.name || 'Product image'}
                                fill
                                className="object-cover"
                                unoptimized
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <FiPackage size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.name}</h4>
                            <p className="text-sm text-gray-600">Số lượng: {item.quantity}</p>
                            
                            {/* Review Button - Show for all orders except cancelled */}
                            {order.status.toLowerCase() !== 'cancelled' && (
                              <div className="mt-2">
                                {item.hasReview ? (
                                  <span className="inline-flex items-center gap-1 text-sm text-green-600">
                                    <FiCheck className="w-4 h-4" />
                                    Đã đánh giá
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => openReviewModal(item, order._id)}
                                    className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                                  >
                                    <FiStar className="w-4 h-4" />
                                    Đánh giá
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                            </p>
                            <p className="text-sm text-gray-500">
                              {item.price.toLocaleString('vi-VN')}₫ × {item.quantity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Total */}
                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-gray-900">Tổng cộng:</span>
                        <span className="text-blue-600">{order.totalAmount.toLocaleString('vi-VN')}₫</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
      
      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={closeReviewModal}
        productId={reviewModal.productId}
        productName={reviewModal.productName}
        productImage={reviewModal.productImage}
        orderId={reviewModal.orderId}
        onSubmitSuccess={handleReviewSuccess}
      />
    </div>
  )
}
