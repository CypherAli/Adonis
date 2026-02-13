'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'
import { useWishlist } from '@/components/providers/WishlistProvider'
import { useCart } from '@/components/providers/CartProvider'
import { 
  FiUser, FiMapPin, FiCreditCard, FiPackage, FiShield, 
  FiHeart, FiStar, FiGift, FiSettings, FiCamera, FiTrash2, 
  FiEdit, FiMail, FiPhone, FiLock, FiSave, FiX, FiPlus,
  FiCheck, FiClock, FiTruck, FiCheckCircle, FiXCircle
} from 'react-icons/fi'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { wishlist, removeFromWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [userData, setUserData] = useState<any>(null)
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [addresses, setAddresses] = useState<any[]>([])
  const [showAddAddress, setShowAddAddress] = useState(false)
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    reviews: 0,
    vouchers: 0,
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchUserData()
      fetchOrders()
      fetchStats()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/auth/me')
      setUserData(response.data)
      setEditForm({
        name: response.data.name || '',
        email: response.data.email || '',
        phone: response.data.phone || '',
        address: response.data.address || '',
      })
      if (response.data.avatar) {
        setAvatarPreview(getAvatarUrl(response.data.avatar))
      }
    } catch (error: any) {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await api.get('/api/orders')
      setOrders(response.data.orders || [])
    } catch (error) {
      // Silent fail
    }
  }

  const fetchStats = async () => {
    try {
      const response = await api.get('/api/auth/stats')
      setStats(response.data)
    } catch (error) {
      // Silent fail
    }
  }

  const getAvatarUrl = (avatarPath: string) => {
    if (!avatarPath) return null
    if (avatarPath.startsWith('http')) return avatarPath
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${avatarPath}`
  }

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      alert('Kích thước ảnh phải nhỏ hơn 5MB')
      return
    }

    if (!file.type.startsWith('image/')) {
      alert('Vui lòng chọn file ảnh')
      return
    }

    const formData = new FormData()
    formData.append('avatar', file)

    try {
      const response = await api.put('/api/auth/profile', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      if (response.data.user?.avatar) {
        setAvatarPreview(getAvatarUrl(response.data.user.avatar))
        setUserData(response.data.user)
      }
    } catch (error) {
      // Silent fail
    }
  }

  const handleAvatarRemove = async () => {
    if (!window.confirm('Bạn có chắc muốn xóa ảnh đại diện?')) return

    try {
      const response = await api.put('/api/auth/profile', { avatar: null })
      setAvatarPreview(null)
      if (response.data.user) {
        setUserData(response.data.user)
      }
    } catch (error) {
      // Silent fail
    }
  }

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await api.put('/api/auth/profile', editForm)
      setUserData(response.data.user || response.data)
      setIsEditing(false)
      alert('Cập nhật thông tin thành công!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Mật khẩu mới không khớp!')
      return
    }

    if (passwordForm.newPassword.length < 6) {
      alert('Mật khẩu phải có ít nhất 6 ký tự!')
      return
    }

    try {
      await api.put('/api/auth/change-password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      })
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      alert('Đổi mật khẩu thành công!')
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra')
    }
  }

  const handleRemoveFromWishlist = async (productId: string) => {
    try {
      await removeFromWishlist(productId)
    } catch (error) {
      console.error('Error removing from wishlist:', error)
      alert('Có lỗi xảy ra khi xóa sản phẩm khỏi danh sách yêu thích')
    }
  }

  const handleAddToCart = async (product: any) => {
    try {
      await addToCart(product, product.variants?.[0]?.sku)
      alert('Đã thêm vào giỏ hàng!')
    } catch (error) {
      alert('Có lỗi xảy ra')
    }
  }

  const getOrderStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50'
      case 'confirmed': return 'text-blue-600 bg-blue-50'
      case 'shipping': return 'text-purple-600 bg-purple-50'
      case 'delivered': return 'text-green-600 bg-green-50'
      case 'cancelled': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getOrderStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <FiClock />
      case 'confirmed': return <FiCheck />
      case 'shipping': return <FiTruck />
      case 'delivered': return <FiCheckCircle />
      case 'cancelled': return <FiXCircle />
      default: return <FiPackage />
    }
  }

  const getOrderStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ xác nhận'
      case 'confirmed': return 'Đã xác nhận'
      case 'shipping': return 'Đang giao'
      case 'delivered': return 'Đã giao'
      case 'cancelled': return 'Đã hủy'
      default: return status
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Đang tải...</p>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Tổng quan', icon: <FiUser /> },
    { id: 'info', label: 'Thông tin', icon: <FiEdit /> },
    { id: 'orders', label: 'Đơn hàng', icon: <FiPackage /> },
    { id: 'wishlist', label: 'Yêu thích', icon: <FiHeart /> },
    { id: 'password', label: 'Đổi mật khẩu', icon: <FiLock /> },
    { id: 'addresses', label: 'Địa chỉ', icon: <FiMapPin /> },
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header - Optimized */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="relative h-32 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
            <div className="absolute -bottom-12 left-6 flex items-end gap-4">
              {/* Avatar */}
              <div className="relative">
                <div className="relative w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-100">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="User avatar"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-400 to-purple-500 text-white text-3xl font-bold">
                      {userData?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full cursor-pointer hover:bg-blue-600 transition-colors shadow-lg">
                  <FiCamera size={14} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-16 px-6 pb-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {userData?.name || session?.user?.name || 'User'}
                </h1>
                <p className="text-gray-600 flex items-center gap-2 mt-1">
                  <FiMail size={16} />
                  {userData?.email || session?.user?.email}
                </p>
              </div>
              
              {userData?.loyaltyPoints && (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg px-4 py-3 border border-yellow-200">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-xs text-gray-600">Điểm tích lũy</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {userData.loyaltyPoints.available || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <FiPackage size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.orders}</p>
                <p className="text-xs text-gray-600">Đơn hàng</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <FiHeart size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlist}</p>
                <p className="text-xs text-gray-600">Yêu thích</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <FiStar size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.reviews}</p>
                <p className="text-xs text-gray-600">Đánh giá</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                <FiGift size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats.vouchers}</p>
                <p className="text-xs text-gray-600">Voucher</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="flex overflow-x-auto border-b">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-blue-500 text-blue-600 bg-blue-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{tab.icon}</span>
                <span className="font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                <div className="text-center py-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Chào mừng trở lại!</h3>
                  <p className="text-gray-600">Xem thông tin tài khoản và đơn hàng của bạn</p>
                </div>

                {/* Recent Orders */}
                {orders.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Đơn hàng gần đây</h4>
                    <div className="space-y-3">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-900">Đơn hàng #{order.orderNumber || order._id?.slice(-6)}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                              </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getOrderStatusColor(order.status)}`}>
                              {getOrderStatusIcon(order.status)}
                              {getOrderStatusText(order.status)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <p className="text-sm text-gray-600">{order.items?.length} sản phẩm</p>
                            <p className="font-bold text-orange-600">{order.total?.toLocaleString()}₫</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Info Tab */}
            {activeTab === 'info' && (
              <div>
                {!isEditing ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Thông tin cá nhân</h3>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <FiEdit size={16} />
                        Chỉnh sửa
                      </button>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="border rounded-lg p-4">
                        <label className="text-sm text-gray-500 mb-1 block">Họ tên</label>
                        <p className="font-medium text-gray-900">{userData?.name || 'Chưa cập nhật'}</p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="text-sm text-gray-500 mb-1 block">Email</label>
                        <p className="font-medium text-gray-900">{userData?.email || 'Chưa cập nhật'}</p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="text-sm text-gray-500 mb-1 block">Số điện thoại</label>
                        <p className="font-medium text-gray-900">{userData?.phone || 'Chưa cập nhật'}</p>
                      </div>

                      <div className="border rounded-lg p-4">
                        <label className="text-sm text-gray-500 mb-1 block">Địa chỉ</label>
                        <p className="font-medium text-gray-900">{userData?.address || 'Chưa cập nhật'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleUpdateProfile} className="space-y-4">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Chỉnh sửa thông tin</h3>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <FiX size={16} />
                          Hủy
                        </button>
                        <button
                          type="submit"
                          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          <FiSave size={16} />
                          Lưu
                        </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Họ tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={editForm.name}
                          onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          required
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Số điện thoại
                        </label>
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Địa chỉ
                        </label>
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng của tôi</h3>
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <FiPackage className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 mb-4">Bạn chưa có đơn hàng nào</p>
                    <button
                      onClick={() => router.push('/products')}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Mua sắm ngay
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div key={order._id} className="border rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="font-semibold text-gray-900 text-lg">
                              Đơn hàng #{order.orderNumber || order._id?.slice(-6)}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Ngày đặt: {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                            </p>
                          </div>
                          <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getOrderStatusColor(order.status)}`}>
                            {getOrderStatusIcon(order.status)}
                            {getOrderStatusText(order.status)}
                          </span>
                        </div>

                        <div className="border-t pt-4 mb-4">
                          <p className="text-sm text-gray-600 mb-2">Sản phẩm:</p>
                          <div className="space-y-2">
                            {order.items?.slice(0, 2).map((item: any, idx: number) => (
                              <div key={item._id || item.productId || `${order._id}-${idx}`} className="flex items-center gap-3 text-sm">
                                <div className="w-12 h-12 bg-gray-100 rounded-lg"></div>
                                <div className="flex-1">
                                  <p className="font-medium text-gray-900">{item.name}</p>
                                  <p className="text-gray-500">x{item.quantity}</p>
                                </div>
                                <p className="font-medium text-gray-900">{item.price?.toLocaleString()}₫</p>
                              </div>
                            ))}
                            {order.items?.length > 2 && (
                              <p className="text-sm text-gray-500">+{order.items.length - 2} sản phẩm khác</p>
                            )}
                          </div>
                        </div>

                        <div className="flex justify-between items-center border-t pt-4">
                          <div>
                            <p className="text-sm text-gray-600">Tổng tiền:</p>
                            <p className="text-xl font-bold text-orange-600">{order.total?.toLocaleString()}₫</p>
                          </div>
                          <button
                            onClick={() => router.push(`/user/orders`)}
                            className="px-6 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            Xem chi tiết
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm yêu thích</h3>
                {wishlist.length === 0 ? (
                  <div className="text-center py-12">
                    <FiHeart className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 mb-4">Chưa có sản phẩm yêu thích</p>
                    <button
                      onClick={() => router.push('/products')}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Khám phá sản phẩm
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {wishlist.map((item: any, index: number) => (
                      <div key={item._id || item.productId || `wishlist-${index}`} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="aspect-square bg-gray-100 rounded-lg mb-3 relative">
                          {item.imageUrl && (
                            <Image
                              src={item.imageUrl}
                              alt={item.name || 'Product image'}
                              fill
                              className="object-cover rounded-lg"
                            />
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-2 line-clamp-2">{item.name}</h4>
                        <p className="text-orange-600 font-bold mb-3">{item.price?.toLocaleString()}₫</p>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddToCart(item)}
                            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
                          >
                            Thêm vào giỏ
                          </button>
                          <button
                            onClick={() => handleRemoveFromWishlist(item._id || item.id)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Password Tab */}
            {activeTab === 'password' && (
              <div className="max-w-md mx-auto">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Đổi mật khẩu</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mật khẩu phải có ít nhất 6 ký tự</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      required
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium"
                  >
                    Đổi mật khẩu
                  </button>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Địa chỉ giao hàng</h3>
                  <button
                    onClick={() => setShowAddAddress(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <FiPlus size={16} />
                    Thêm địa chỉ
                  </button>
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-12">
                    <FiMapPin className="mx-auto text-gray-400 mb-3" size={48} />
                    <p className="text-gray-600 mb-4">Chưa có địa chỉ giao hàng</p>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {addresses.map((addr) => (
                      <div key={addr._id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <p className="font-medium text-gray-900">{addr.name}</p>
                            <p className="text-sm text-gray-600">{addr.phone}</p>
                          </div>
                          {addr.isDefault && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Mặc định</span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{addr.address}</p>
                        <div className="flex gap-2">
                          <button className="text-sm text-blue-500 hover:text-blue-600">Sửa</button>
                          <button className="text-sm text-red-500 hover:text-red-600">Xóa</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
