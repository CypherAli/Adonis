'use client'

import React, { useState, useEffect } from 'react'
import api from '@/lib/api'
import '../ProfileTabs.css'

interface Address {
  _id: string
  label: string
  fullName: string
  phone: string
  address: {
    street: string
    ward: string
    district: string
    city: string
    zipCode: string
  }
  isDefault: boolean
}

const AddressManagement: React.FC = () => {
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
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

  const fetchAddresses = async () => {
    try {
      const response = await api.get('/api/user/addresses')
      setAddresses(response.data)
    } catch (error) {
      console.error('Fetch addresses error:', error)
      alert('Không thể tải địa chỉ!')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAddresses()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingId) {
        await api.put(`/api/user/addresses/${editingId}`, formData)
        alert('Address updated successfully!')
      } else {
        await api.post('/api/user/addresses', formData)
        alert('Thêm địa chỉ thành công!')
      }

      fetchAddresses()
      resetForm()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Thao tác thất bại!')
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bạn có chắc muốn xóa địa chỉ này?')) return

    try {
      await api.delete(`/api/user/addresses/${id}`)
      alert('Xóa địa chỉ thành công!')
      fetchAddresses()
    } catch (error) {
      alert('Cannot delete address!')
    }
  }

  const handleEdit = (address: Address) => {
    setFormData(address)
    setEditingId(address._id)
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
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
    setEditingId(null)
    setShowForm(false)
  }

  if (loading) return <div className="tab-loading">Đang tải...</div>

  return (
    <div className="address-management">
      <button className="btn-primary mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Cancel' : '+ Add new address'}
      </button>

      {showForm && (
        <form onSubmit={handleSubmit} className="address-form">
          <div className="form-row">
            <div className="form-group">
              <label>Nhãn địa chỉ *</label>
              <input
                type="text"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="Nhà, Văn phòng..."
                required
              />
            </div>
            <div className="form-group">
              <label>Họ tên người nhận *</label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Số điện thoại *</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Địa chỉ chi tiết *</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  address: { ...formData.address, street: e.target.value },
                })
              }
              placeholder="Số nhà, tên đường"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Thành phố *</label>
              <input
                type="text"
                value={formData.address.city}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, city: e.target.value },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Quận/Huyện *</label>
              <input
                type="text"
                value={formData.address.district}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, district: e.target.value },
                  })
                }
                required
              />
            </div>
            <div className="form-group">
              <label>Phường/Xã *</label>
              <input
                type="text"
                value={formData.address.ward}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    address: { ...formData.address, ward: e.target.value },
                  })
                }
                required
              />
            </div>
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.isDefault}
                onChange={(e) => setFormData({ ...formData, isDefault: e.target.checked })}
              />
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <button type="submit" className="btn-primary">
            {editingId ? 'Update' : 'Add address'}
          </button>
        </form>
      )}

      <div className="address-list">
        {addresses.length === 0 ? (
          <p className="no-data">Chưa có địa chỉ nào</p>
        ) : (
          addresses.map((addr) => (
            <div key={addr._id} className={`address-card ${addr.isDefault ? 'default' : ''}`}>
              {addr.isDefault && <span className="default-badge">Mặc định</span>}
              <h4>{addr.label}</h4>
              <p>
                <strong>{addr.fullName}</strong> | {addr.phone}
              </p>
              <p>
                {addr.address?.street}, {addr.address?.ward}, {addr.address?.district},{' '}
                {addr.address?.city}
              </p>
              <div className="address-actions">
                <button onClick={() => handleEdit(addr)}>Sửa</button>
                <button onClick={() => handleDelete(addr._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default AddressManagement
