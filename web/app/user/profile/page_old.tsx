'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import api from '@/lib/api'
import { 
  FiUser, FiMapPin, FiCreditCard, FiPackage, FiShield, 
  FiHeart, FiStar, FiGift, FiSettings, FiCamera, FiTrash2 
} from 'react-icons/fi'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated') {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await api.get('/api/auth/me')
      setUserData(response.data)
      if (response.data.avatar) {
        setAvatarPreview(getAvatarUrl(response.data.avatar))
      }
    } catch (error: any) {
      // Silent fail - handled by api interceptor
    } finally {
      setLoading(false)
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
      console.error('Error uploading avatar:', error)
      alert('Không thể cập nhật ảnh đại diện')
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
      console.error('Error removing avatar:', error)
      alert('Không thể xóa ảnh đại diện')
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
    { id: 'addresses', label: 'Địa chỉ', icon: <FiMapPin /> },
    { id: 'payment', label: 'Thanh toán', icon: <FiCreditCard /> },
    { id: 'orders', label: 'Đơn hàng', icon: <FiPackage /> },
    { id: 'warranty', label: 'Bảo hành', icon: <FiShield /> },
    { id: 'wishlist', label: 'Yêu thích', icon: <FiHeart /> },
    { id: 'reviews', label: 'Đánh giá', icon: <FiStar /> },
    { id: 'vouchers', label: 'Voucher', icon: <FiGift /> },
    { id: 'settings', label: 'Cài đặt', icon: <FiSettings /> },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="relative h-32 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="absolute -bottom-16 left-8 flex items-end gap-6">
              {/* Avatar */}
              <div className="relative">
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gray-200">
                  {avatarPreview ? (
                    <Image
                      src={avatarPreview}
                      alt="User avatar"
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-500 text-white text-4xl font-bold">
                      {userData?.name?.[0]?.toUpperCase() || 'U'}
                    </div>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
                  <FiCamera size={18} />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                </label>
                {avatarPreview && (
                  <button
                    onClick={handleAvatarRemove}
                    className="absolute top-0 right-0 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors shadow-lg"
                    title="Xóa ảnh"
                  >
                    <FiTrash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="pt-20 px-8 pb-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {userData?.name || session?.user?.name || 'User'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {userData?.email || session?.user?.email}
                </p>
                {userData?.membershipTier && (
                  <span className="inline-block mt-3 px-4 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-semibold shadow-md">
                    {userData.membershipTier.toUpperCase()} MEMBER
                  </span>
                )}
              </div>
              
              {userData?.loyaltyPoints && (
                <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <div className="flex items-center gap-3">
                    <div className="text-4xl">⭐</div>
                    <div>
                      <p className="text-sm text-gray-600">Điểm tích lũy</p>
                      <p className="text-3xl font-bold text-orange-600">
                        {userData.loyaltyPoints.available || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-fit px-6 py-4 flex items-center justify-center gap-2 transition-all border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 bg-blue-50 text-blue-600'
                    : 'border-transparent text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span className="font-medium whitespace-nowrap">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl shadow-lg p-8 min-h-[500px]">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Thống kê tài khoản</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-600 text-white p-4 rounded-lg">
                      <FiPackage size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Tổng đơn hàng</p>
                      <p className="text-3xl font-bold text-blue-600">0</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-purple-600 text-white p-4 rounded-lg">
                      <FiHeart size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Sản phẩm yêu thích</p>
                      <p className="text-3xl font-bold text-purple-600">0</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-600 text-white p-4 rounded-lg">
                      <FiStar size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Đánh giá</p>
                      <p className="text-3xl font-bold text-green-600">0</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-4">
                <span className="text-4xl">{tabs.find(t => t.id === activeTab)?.icon}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {tabs.find(t => t.id === activeTab)?.label}
              </h3>
              <p className="text-gray-500">Nội dung đang được phát triển...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
