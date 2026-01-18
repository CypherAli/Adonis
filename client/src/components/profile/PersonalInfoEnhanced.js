import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axiosConfig';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { getAvatarUrl } from '../../utils/imageHelpers';
import { 
    FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, 
    FiLock, FiSave, FiCamera, FiPlus, FiTrash2,
    FiHome, FiBriefcase, FiSettings, FiBell
} from 'react-icons/fi';
import './ProfileEnhanced.css';

const PersonalInfoEnhanced = ({ userData, onUpdate }) => {
    const { user, userDetails, updateUser } = useContext(AuthContext);
    const toast = useToast();
    const [activeTab, setActiveTab] = useState('personal'); // personal, addresses, preferences
    
    // Personal info state
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        phone: '',
        address: '',
        dateOfBirth: '',
        gender: ''
    });
    const [avatar, setAvatar] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showPasswordChange, setShowPasswordChange] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Addresses state
    const [addresses, setAddresses] = useState([]);
    const [newAddress, setNewAddress] = useState({
        label: 'home',
        fullName: '',
        phone: '',
        address: {
            street: '',
            ward: '',
            district: '',
            city: '',
            zipCode: ''
        },
        isDefault: false
    });

    // Preferences state
    const [preferences, setPreferences] = useState({
        notifications: {
            email: {
                orderUpdates: true,
                priceAlerts: true,
                promotions: true,
                warrantyReminders: true
            },
            push: {
                orderUpdates: true,
                priceAlerts: false,
                promotions: false
            }
        },
        language: 'vi',
        currency: 'VND'
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                name: userData.name || '',
                username: userData.username || userDetails?.username || user?.username || '',
                email: userData.email || userDetails?.email || user?.email || '',
                phone: userData.phone || '',
                address: userData.address || '',
                dateOfBirth: userData.dateOfBirth ? userData.dateOfBirth.split('T')[0] : '',
                gender: userData.gender || ''
            });
            const avatarPath = userData.avatar || userDetails?.avatar || user?.avatar || null;
            setAvatarPreview(getAvatarUrl(avatarPath));
            setAddresses(userData.addresses || []);
            if (userData.preferences) {
                setPreferences(userData.preferences);
            }
        }
    }, [userData, user, userDetails]);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước ảnh phải nhỏ hơn 5MB');
                return;
            }

            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh');
                return;
            }

            setAvatar(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            
            // Append basic fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append avatar if changed
            if (avatar) {
                formDataToSend.append('avatar', avatar);
            }

            // Append password fields if provided
            if (passwordData.currentPassword && passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    toast.error('Mật khẩu mới không khớp');
                    setLoading(false);
                    return;
                }
                formDataToSend.append('currentPassword', passwordData.currentPassword);
                formDataToSend.append('newPassword', passwordData.newPassword);
            }

            const response = await axios.put('/auth/profile', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('Cập nhật thông tin thành công!');
                
                // Update user in context
                if (response.data.user) {
                    updateUser(response.data.user);
                    // Update avatar preview
                    if (response.data.user.avatar) {
                        setAvatarPreview(getAvatarUrl(response.data.user.avatar));
                    }
                }
                
                if (onUpdate) {
                    onUpdate(response.data.user);
                }
                // Reset password fields
                setPasswordData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setShowPasswordChange(false);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật thông tin');
        } finally {
            setLoading(false);
        }
    };

    // Address management functions
    const handleAddressChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setNewAddress({
                ...newAddress,
                [parent]: {
                    ...newAddress[parent],
                    [child]: value
                }
            });
        } else {
            setNewAddress({
                ...newAddress,
                [field]: value
            });
        }
    };

    const addAddress = async () => {
        try {
            const response = await axios.post('/auth/profile/addresses', newAddress);
            if (response.data.success) {
                setAddresses(response.data.addresses);
                toast.success('Thêm địa chỉ thành công!');
                // Reset form
                setNewAddress({
                    label: 'home',
                    fullName: '',
                    phone: '',
                    address: {
                        street: '',
                        ward: '',
                        district: '',
                        city: '',
                        zipCode: ''
                    },
                    isDefault: false
                });
            }
        } catch (error) {
            toast.error('Có lỗi khi thêm địa chỉ');
        }
    };

    const deleteAddress = async (addressId) => {
        try {
            const response = await axios.delete(`/auth/profile/addresses/${addressId}`);
            if (response.data.success) {
                setAddresses(response.data.addresses);
                toast.success('Xóa địa chỉ thành công!');
            }
        } catch (error) {
            toast.error('Có lỗi khi xóa địa chỉ');
        }
    };

    const setDefaultAddress = async (addressId) => {
        try {
            const response = await axios.put(`/auth/profile/addresses/${addressId}/default`);
            if (response.data.success) {
                setAddresses(response.data.addresses);
                toast.success('Đã đặt làm địa chỉ mặc định');
            }
        } catch (error) {
            toast.error('Có lỗi khi cập nhật địa chỉ');
        }
    };

    // Preferences management
    const updatePreferences = async () => {
        try {
            const response = await axios.put('/auth/profile/preferences', preferences);
            if (response.data.success) {
                toast.success('Cập nhật tùy chọn thành công!');
            }
        } catch (error) {
            toast.error('Có lỗi khi cập nhật tùy chọn');
        }
    };

    const handleNotificationChange = (type, category, field, value) => {
        setPreferences({
            ...preferences,
            notifications: {
                ...preferences.notifications,
                [type]: {
                    ...preferences.notifications[type],
                    [field]: value
                }
            }
        });
    };

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
                                <img src={avatarPreview} alt="Avatar" />
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
                            {user?.membershipTier && (
                                <span className={`member-badge ${user.membershipTier}`}>
                                    {user.membershipTier.toUpperCase()}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="form-section">
                        <h4><FiUser /> Thông tin cơ bản</h4>
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
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                >
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
                                rows="3"
                            />
                        </div>
                    </div>

                    {/* Password Change Section */}
                    <div className="form-section">
                        <div className="section-header">
                            <h4><FiLock /> Đổi mật khẩu</h4>
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
                        <button 
                            type="submit" 
                            className="btn-save-profile"
                            disabled={loading}
                        >
                            <FiSave /> {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
                <div className="addresses-section">
                    <div className="section-header">
                        <h4><FiMapPin /> Sổ địa chỉ</h4>
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
                                            {addr.label === 'home' ? 'Nhà riêng' : addr.label === 'office' ? 'Văn phòng' : 'Khác'}
                                        </span>
                                        {addr.isDefault && (
                                            <span className="default-badge">Mặc định</span>
                                        )}
                                    </div>
                                    <div className="address-content">
                                        <p className="address-name">{addr.fullName}</p>
                                        <p className="address-phone">{addr.phone}</p>
                                        <p className="address-detail">
                                            {addr.address.street}, {addr.address.ward}, {addr.address.district}, {addr.address.city}
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
                                        <button 
                                            className="btn-delete-address"
                                            onClick={() => deleteAddress(addr._id)}
                                        >
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
                        <h5><FiPlus /> Thêm địa chỉ mới</h5>
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

                        <button 
                            type="button"
                            className="btn-add-address"
                            onClick={addAddress}
                        >
                            <FiPlus /> Thêm địa chỉ
                        </button>
                    </div>
                </div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
                <div className="preferences-section">
                    <div className="section-header">
                        <h4><FiSettings /> Tùy chọn cá nhân</h4>
                    </div>

                    {/* Notification Preferences */}
                    <div className="preference-group">
                        <h5><FiBell /> Email Notifications</h5>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.email.orderUpdates}
                                    onChange={(e) => handleNotificationChange('email', null, 'orderUpdates', e.target.checked)}
                                />
                                Order updates
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.email.priceAlerts}
                                    onChange={(e) => handleNotificationChange('email', null, 'priceAlerts', e.target.checked)}
                                />
                                Price alerts
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.email.promotions}
                                    onChange={(e) => handleNotificationChange('email', null, 'promotions', e.target.checked)}
                                />
                                Promotions and deals
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.email.warrantyReminders}
                                    onChange={(e) => handleNotificationChange('email', null, 'warrantyReminders', e.target.checked)}
                                />
                                Nhắc nhở bảo hành
                            </label>
                        </div>
                    </div>

                    <div className="preference-group">
                        <h5><FiBell /> Push Notifications</h5>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.push.orderUpdates}
                                    onChange={(e) => handleNotificationChange('push', null, 'orderUpdates', e.target.checked)}
                                />
                                Order updates
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.push.priceAlerts}
                                    onChange={(e) => handleNotificationChange('push', null, 'priceAlerts', e.target.checked)}
                                />
                                Price alerts
                            </label>
                        </div>
                        <div className="preference-item">
                            <label>
                                <input
                                    type="checkbox"
                                    checked={preferences.notifications.push.promotions}
                                    onChange={(e) => handleNotificationChange('push', null, 'promotions', e.target.checked)}
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
                                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                                >
                                    <option value="vi">Tiếng Việt</option>
                                    <option value="en">English</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Đơn vị tiền tệ</label>
                                <select
                                    value={preferences.currency}
                                    onChange={(e) => setPreferences({...preferences, currency: e.target.value})}
                                >
                                    <option value="VND">VND (₫)</option>
                                    <option value="USD">USD ($)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-actions">
                        <button 
                            type="button"
                            className="btn-save-profile"
                            onClick={updatePreferences}
                        >
                            <FiSave /> Lưu tùy chọn
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonalInfoEnhanced;
