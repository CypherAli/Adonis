'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { FiBell, FiLock, FiEye, FiEyeOff, FiGlobe, FiShield, FiMail, FiSave, FiAlertCircle } from 'react-icons/fi'

export default function SettingsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    promotionalEmails: true,
    orderUpdates: true,
    language: 'vi',
    twoFactor: false,
  })

  const [showChangePassword, setShowChangePassword] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Load user settings from localStorage
  useEffect(() => {
    if (!session?.user) return
    
    const savedSettings = localStorage.getItem(`userSettings_${session.user.email}`)
    if (savedSettings) {
      try {
        setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }))
      } catch (error) {
        console.error('Failed to load settings:', error)
      }
    }
  }, [session?.user])

  const handleToggle = (key: keyof typeof settings) => {
    const newValue = !settings[key]
    const newSettings = { ...settings, [key]: newValue }
    setSettings(newSettings)
    
    // Auto-save to localStorage
    if (session?.user) {
      try {
        localStorage.setItem(`userSettings_${session.user.email}`, JSON.stringify(newSettings))
        setSaveStatus('saved')
        setTimeout(() => setSaveStatus('idle'), 2000)
      } catch (error) {
        console.error('Failed to save setting:', error)
      }
    }
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' })
      return
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Mật khẩu phải có ít nhất 6 ký tự!' })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await api.post('/api/user/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      }, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      })

      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setShowChangePassword(false)
    } catch (error: any) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Đổi mật khẩu thất bại. Vui lòng kiểm tra mật khẩu hiện tại.' 
      })
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Cài đặt</h1>
              <p className="text-gray-600">Quản lý tùy chọn tài khoản và thông báo của bạn</p>
            </div>
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg">
                <FiSave size={20} />
                <span className="font-medium">Đã lưu</span>
              </div>
            )}
          </div>
        </div>

        {/* Alert Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${
            message.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            <FiAlertCircle className="mt-0.5 flex-shrink-0" size={20} />
            <p className="font-medium">{message.text}</p>
          </div>
        )}

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
              <FiBell size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Thông báo</h2>
              <p className="text-sm text-gray-600">Quản lý cách bạn nhận thông báo</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Email thông báo</h3>
                <p className="text-sm text-gray-600">Nhận thông báo qua email</p>
              </div>
              <button
                onClick={() => handleToggle('emailNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.emailNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">SMS thông báo</h3>
                <p className="text-sm text-gray-600">Nhận thông báo qua tin nhắn</p>
              </div>
              <button
                onClick={() => handleToggle('smsNotifications')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.smsNotifications ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.smsNotifications ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Email khuyến mãi</h3>
                <p className="text-sm text-gray-600">Nhận email về các chương trình khuyến mãi</p>
              </div>
              <button
                onClick={() => handleToggle('promotionalEmails')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.promotionalEmails ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.promotionalEmails ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Cập nhật đơn hàng</h3>
                <p className="text-sm text-gray-600">Nhận thông báo về trạng thái đơn hàng</p>
              </div>
              <button
                onClick={() => handleToggle('orderUpdates')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.orderUpdates ? 'bg-blue-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.orderUpdates ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 text-green-600 p-3 rounded-lg">
              <FiShield size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Bảo mật</h2>
              <p className="text-sm text-gray-600">Quản lý cài đặt bảo mật tài khoản</p>
            </div>
          </div>

          <div className="space-y-4">
            <button 
              onClick={() => setShowChangePassword(!showChangePassword)}
              className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FiLock className="text-gray-600" size={20} />
                <div className="text-left">
                  <h3 className="font-semibold text-gray-900">Đổi mật khẩu</h3>
                  <p className="text-sm text-gray-600">Thay đổi mật khẩu tài khoản</p>
                </div>
              </div>
              <span className="text-gray-400">{showChangePassword ? '▼' : '→'}</span>
            </button>

            {/* Change Password Form */}
            {showChangePassword && (
              <form onSubmit={handleChangePassword} className="p-6 bg-blue-50 rounded-xl space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu hiện tại
                  </label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu hiện tại"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showCurrentPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? 'text' : 'password'}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={6}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showNewPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Xác nhận mật khẩu mới
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nhập lại mật khẩu mới"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowChangePassword(false)
                      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
                      setMessage(null)
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            )}

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <FiShield className="text-gray-600" size={20} />
                <div>
                  <h3 className="font-semibold text-gray-900">Xác thực 2 bước</h3>
                  <p className="text-sm text-gray-600">Tăng cường bảo mật tài khoản</p>
                </div>
              </div>
              <button
                onClick={() => handleToggle('twoFactor')}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.twoFactor ? 'bg-green-600' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Language Section */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
              <FiGlobe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Ngôn ngữ & Khu vực</h2>
              <p className="text-sm text-gray-600">Tùy chỉnh ngôn ngữ hiển thị</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div>
                <h3 className="font-semibold text-gray-900">Ngôn ngữ</h3>
                <p className="text-sm text-gray-600">Tiếng Việt</p>
              </div>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                Thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
