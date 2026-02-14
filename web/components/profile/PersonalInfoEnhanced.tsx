'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import { getAvatarUrl } from '@/lib/image_helpers'
import {
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiCalendar,
  FiLock,
  FiSave,
  FiCamera,
  FiPlus,
  FiTrash2,
  FiHome,
  FiBriefcase,
  FiSettings,
  FiBell,
} from 'react-icons/fi'
import '../ProfileEnhanced.css'

interface PersonalInfoEnhancedProps {
  userData: any
  onUpdate?: (data: any) => void
}

const PersonalInfoEnhanced: React.FC<PersonalInfoEnhancedProps> = ({ userData, onUpdate }) => {
  const [activeTab, setActiveTab] = useState('personal')
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
    gender: '',
  })
  const [avatar, setAvatar] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPasswordChange, setShowPasswordChange] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [addresses, setAddresses] = useState<any[]>([])
  const [newAddress, setNewAddress] = useState({
    label: 'home',
    fullName: '',
    phone: '',
    address: {
      street: '',
      ward: '',
      district: '',
      city: '',
      zipCode: '',
    },
    isDefault: false,
  })
  const [preferences, setPreferences] = useState({
    notifications: {
      email: {
        orderUpdates: true,
        priceAlerts: true,
        promotions: true,
        warrantyReminders: true,
      },
      push: {
        orderUpdates: true,
        priceAlerts: false,
        promotions: false,
      },
    },
    language: 'vi',
    currency: 'VND',
  })

  useEffect(() => {
    if (userData) {
      setFormData({
        name: userData.name || '',
        username: userData.username || '',
        email: userData.email || '',
        phone: userData.phone || '',
        address: userData.address || '',
        dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
        gender: userData.gender || '',
      })
      setAvatarPreview(getAvatarUrl(userData.avatar))
      setAddresses(userData.addresses || [])
      if (userData.preferences) {
        setPreferences(userData.preferences)
      }
    }
  }, [userData])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('Kích thước ảnh phải nhỏ hơn 5MB')
        return
      }

      if (!file.type.startsWith('image/')) {
        alert('Vui lòng chọn file ảnh')
        return
      }

      setAvatar(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const formDataToSend = new FormData()

      Object.keys(formData).forEach((key) => {
        if ((formData as any)[key]) {
          formDataToSend.append(key, (formData as any)[key])
        }
      })

      if (avatar) {
        formDataToSend.append('avatar', avatar)
      }

      if (passwordData.currentPassword && passwordData.newPassword) {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
          alert('Mật khẩu mới không khớp')
          setLoading(false)
          return
        }
        formDataToSend.append('currentPassword', passwordData.currentPassword)
        formDataToSend.append('newPassword', passwordData.newPassword)
      }

      const response = await api.put('/api/auth/profile', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      if (response.data.success) {
        alert('Cập nhật thông tin thành công!')

        if (response.data.user) {
          if (onUpdate) {
            onUpdate(response.data.user)
          }
          if (response.data.user.avatar) {
            const avatarUrl = response.data.user.avatar.startsWith('http')
              ? response.data.user.avatar
              : `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'}${response.data.user.avatar}`
            setAvatarPreview(avatarUrl)
          }
        }

        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
        setShowPasswordChange(false)
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin')
    } finally {
      setLoading(false)
    }
  }

  const handleAddressChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setNewAddress({
        ...newAddress,
        [parent]: {
          ...(newAddress as any)[parent],
          [child]: value,
        },
      })
    } else {
      setNewAddress({
        ...newAddress,
        [field]: value,
      })
    }
  }

  const addAddress = async () => {
    try {
      const response = await api.post('/api/auth/profile/addresses', newAddress)
      if (response.data.success) {
        setAddresses(response.data.addresses)
        alert('Thêm địa chỉ thành công!')
        setNewAddress({
          label: 'home',
          fullName: '',
          phone: '',
          address: {
            street: '',
            ward: '',
            district: '',
            city: '',
            zipCode: '',
          },
          isDefault: false,
        })
      }
    } catch (error) {
      alert('Có lỗi khi thêm địa chỉ')
    }
  }

  const deleteAddress = async (addressId: string) => {
    try {
      const response = await api.delete(`/api/auth/profile/addresses/${addressId}`)
      if (response.data.success) {
        setAddresses(response.data.addresses)
        alert('Xóa địa chỉ thành công!')
      }
    } catch (error) {
      alert('Có lỗi khi xóa địa chỉ')
    }
  }

  const setDefaultAddress = async (addressId: string) => {
    try {
      const response = await api.put(`/api/auth/profile/addresses/${addressId}/default`)
      if (response.data.success) {
        setAddresses(response.data.addresses)
        alert('Đã đặt làm địa chỉ mặc định')
      }
    } catch (error) {
      alert('Có lỗi khi cập nhật địa chỉ')
    }
  }

  const updatePreferences = async () => {
    try {
      const response = await api.put('/api/auth/profile/preferences', preferences)
      if (response.data.success) {
        alert('Cập nhật tùy chọn thành công!')
      }
    } catch (error) {
      alert('Có lỗi khi cập nhật tùy chọn')
    }
  }

  const handleNotificationChange = (type: string, field: string, value: boolean) => {
    setPreferences({
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [type]: {
          ...preferences.notifications[type as keyof typeof preferences.notifications],
          [field]: value,
        },
      },
    })
  }

  return (
    <div className="personal-info-enhanced">
      {/* Tab Navigation */}
      <div className="profile-tab-nav">
        <button
          className={`tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
          onClick={() => setActiveTab('personal')}
        >
          <FiUser /> Thông tin cá nhân
        </button>
        <button
          className={`tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
          onClick={() => setActiveTab('addresses')}
        >
          <FiMapPin /> Địa chỉ giao hàng
        </button>
        <button
          className={`tab-btn ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <FiSettings /> Tùy chọn
        </button>
      </div>

      {/* Personal Info Tab */}
      {activeTab === 'personal' && (
        <form onSubmit={handleSubmit} className="profile-form-enhanced">
          {/* Avatar Section */}
          <div className="avatar-section-enhanced">
            <div className="avatar-preview-large">
              {avatarPreview ? (
                <img 
                  src={avatarPreview} 
                  alt="Avatar"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.style.display = 'none'
                  }}
                />
              ) : (
                <div className="avatar-placeholder">
                  <FiUser size={50} />
                </div>
              )}
              <label htmlFor="avatar-upload" className="avatar-upload-overlay">
                <FiCamera size={24} />
                <span>Thay đổi</span>
              </label>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'none' }}
              />
            </div>
            <div className="avatar-info">
              <h3>{formData.name || formData.username}</h3>
              <p>{formData.email}</p>
              {userData?.membershipTier && (
                <span className={`member-badge ${userData.membershipTier}`}>
                  {userData.membershipTier.toUpperCase()}
                </span>
              )}
            </div>
          </div>

          {/* Basic Info */}
          <div className="form-section">
            <h4>
              <FiUser /> Thông tin cơ bản
            </h4>
            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiUser /> Họ và tên
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Nhập họ tên đầy đủ"
                />
              </div>
              <div className="form-group">
                <label>
                  <FiUser /> Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Username"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiMail /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                />
              </div>
              <div className="form-group">
                <label>
                  <FiPhone /> Số điện thoại
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>
                  <FiCalendar /> Ngày sinh
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Giới tính</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
              </div>
            </div>

            <div className="form-group full-width">
              <label>
                <FiMapPin /> Địa chỉ
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Nhập địa chỉ của bạn"
                rows={3}
              />
            </div>
          </div>

          {/* Password Change Section */}
          <div className="form-section">
            <div className="section-header">
              <h4>
                <FiLock /> Đổi mật khẩu
              </h4>
              <button
                type="button"
                className="btn-toggle-password"
                onClick={() => setShowPasswordChange(!showPasswordChange)}
              >
                {showPasswordChange ? 'Ẩn' : 'Hiển thị'}
              </button>
            </div>

            {showPasswordChange && (
              <div className="password-fields">
                <div className="form-group">
                  <label>Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu hiện tại"
                  />
                </div>
                <div className="form-group">
                  <label>Mật khẩu mới</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>
                <div className="form-group">
                  <label>Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button type="submit" className="btn-save-profile" disabled={loading}>
              <FiSave /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
            </button>
          </div>
        </form>
      )}

      {/* Addresses Tab - PHẦN 2 SẼ TIẾP TỤC Ở FILE RIÊNG */}
      {activeTab === 'addresses' && (
        <div className="addresses-section">
          <div className="section-header">
            <h4>
              <FiMapPin /> Sổ địa chỉ
            </h4>
          </div>

          {/* Existing Addresses */}
          <div className="addresses-list">
            {addresses.length > 0 ? (
              addresses.map((addr, index) => (
                <div key={index} className="address-card">
                  <div className="address-header">
                    <span className={`address-label ${addr.label}`}>
                      {addr.label === 'home' && <FiHome />}
                      {addr.label === 'office' && <FiBriefcase />}
                      {addr.label === 'other' && <FiMapPin />}
                      {addr.label === 'home'
                        ? 'Nhà riêng'
                        : addr.label === 'office'
                          ? 'Văn phòng'
                          : 'Khác'}
                    </span>
                    {addr.isDefault && <span className="default-badge">Mặc định</span>}
                  </div>
                  <div className="address-content">
                    <p className="address-name">{addr.fullName}</p>
                    <p className="address-phone">{addr.phone}</p>
                    <p className="address-detail">
                      {addr.address.street}, {addr.address.ward}, {addr.address.district},{' '}
                      {addr.address.city}
                    </p>
                  </div>
                  <div className="address-actions">
                    {!addr.isDefault && (
                      <button
                        className="btn-set-default"
                        onClick={() => setDefaultAddress(addr._id)}
                      >
                        Đặt mặc định
                      </button>
                    )}
                    <button className="btn-delete-address" onClick={() => deleteAddress(addr._id)}>
                      <FiTrash2 /> Xóa
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-addresses">Bạn chưa có địa chỉ nào. Thêm địa chỉ mới bên dưới.</p>
            )}
          </div>

          {/* Add New Address */}
          <div className="add-address-form">
            <h5>
              <FiPlus /> Thêm địa chỉ mới
            </h5>
            <div className="form-row">
              <div className="form-group">
                <label>Loại địa chỉ</label>
                <select
                  value={newAddress.label}
                  onChange={(e) => handleAddressChange('label', e.target.value)}
                >
                  <option value="home">Nhà riêng</option>
                  <option value="office">Văn phòng</option>
                  <option value="other">Khác</option>
                </select>
              </div>
              <div className="form-group">
                <label>Họ và tên</label>
                <input
                  type="text"
                  value={newAddress.fullName}
                  onChange={(e) => handleAddressChange('fullName', e.target.value)}
                  placeholder="Người nhận hàng"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Số điện thoại</label>
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => handleAddressChange('phone', e.target.value)}
                  placeholder="0123456789"
                />
              </div>
              <div className="form-group">
                <label>Số nhà, tên đường</label>
                <input
                  type="text"
                  value={newAddress.address.street}
                  onChange={(e) => handleAddressChange('address.street', e.target.value)}
                  placeholder="123 Đường ABC"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Phường/Xã</label>
                <input
                  type="text"
                  value={newAddress.address.ward}
                  onChange={(e) => handleAddressChange('address.ward', e.target.value)}
                  placeholder="Phường 1"
                />
              </div>
              <div className="form-group">
                <label>Quận/Huyện</label>
                <input
                  type="text"
                  value={newAddress.address.district}
                  onChange={(e) => handleAddressChange('address.district', e.target.value)}
                  placeholder="Quận 1"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Tỉnh/Thành phố</label>
                <input
                  type="text"
                  value={newAddress.address.city}
                  onChange={(e) => handleAddressChange('address.city', e.target.value)}
                  placeholder="TP. Hồ Chí Minh"
                />
              </div>
              <div className="form-group">
                <label>Mã bưu điện</label>
                <input
                  type="text"
                  value={newAddress.address.zipCode}
                  onChange={(e) => handleAddressChange('address.zipCode', e.target.value)}
                  placeholder="700000"
                />
              </div>
            </div>

            <div className="form-group checkbox-group">
              <label>
                <input
                  type="checkbox"
                  checked={newAddress.isDefault}
                  onChange={(e) => handleAddressChange('isDefault', e.target.checked)}
                />
                Đặt làm địa chỉ mặc định
              </label>
            </div>

            <button type="button" className="btn-add-address" onClick={addAddress}>
              <FiPlus /> Thêm địa chỉ
            </button>
          </div>
        </div>
      )}

      {/* Preferences Tab */}
      {activeTab === 'preferences' && (
        <div className="preferences-section">
          <div className="section-header">
            <h4>
              <FiSettings /> Tùy chọn cá nhân
            </h4>
          </div>

          {/* Notification Preferences */}
          <div className="preference-group">
            <h5>
              <FiBell /> Email Notifications
            </h5>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email.orderUpdates}
                  onChange={(e) =>
                    handleNotificationChange('email', 'orderUpdates', e.target.checked)
                  }
                />
                Order updates
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email.priceAlerts}
                  onChange={(e) =>
                    handleNotificationChange('email', 'priceAlerts', e.target.checked)
                  }
                />
                Price alerts
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email.promotions}
                  onChange={(e) =>
                    handleNotificationChange('email', 'promotions', e.target.checked)
                  }
                />
                Promotions and deals
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.email.warrantyReminders}
                  onChange={(e) =>
                    handleNotificationChange('email', 'warrantyReminders', e.target.checked)
                  }
                />
                Nhắc nhở bảo hành
              </label>
            </div>
          </div>

          <div className="preference-group">
            <h5>
              <FiBell /> Push Notifications
            </h5>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push.orderUpdates}
                  onChange={(e) =>
                    handleNotificationChange('push', 'orderUpdates', e.target.checked)
                  }
                />
                Order updates
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push.priceAlerts}
                  onChange={(e) =>
                    handleNotificationChange('push', 'priceAlerts', e.target.checked)
                  }
                />
                Price alerts
              </label>
            </div>
            <div className="preference-item">
              <label>
                <input
                  type="checkbox"
                  checked={preferences.notifications.push.promotions}
                  onChange={(e) =>
                    handleNotificationChange('push', 'promotions', e.target.checked)
                  }
                />
                Khuyến mãi và ưu đãi
              </label>
            </div>
          </div>

          {/* Language & Currency */}
          <div className="preference-group">
            <h5>Ngôn ngữ & Tiền tệ</h5>
            <div className="form-row">
              <div className="form-group">
                <label>Ngôn ngữ</label>
                <select
                  value={preferences.language}
                  onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                >
                  <option value="vi">Tiếng Việt</option>
                  <option value="en">English</option>
                </select>
              </div>
              <div className="form-group">
                <label>Đơn vị tiền tệ</label>
                <select
                  value={preferences.currency}
                  onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                >
                  <option value="VND">VND (₫)</option>
                  <option value="USD">USD ($)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-save-profile" onClick={updatePreferences}>
              <FiSave /> Lưu tùy chọn
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PersonalInfoEnhanced
