import React, { useState, useEffect, useContext } from 'react';
import axios from '../../api/axiosConfig';
import AuthContext from '../../context/AuthContext';
import { useToast } from '../common/Toast';
import { getAvatarUrl } from '../../utils/imageHelpers';
import './ProfileTabs.css';

const PersonalInfo = ({ userData, onUpdate }) => {
    const { user, userDetails, updateUser } = useContext(AuthContext);
    const toast = useToast();
    
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
            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Kích thước file không được vượt quá 5MB');
                return;
            }

            // Check file type
            if (!file.type.startsWith('image/')) {
                toast.error('Vui lòng chọn file ảnh');
                return;
            }

            setAvatar(file);
            
            // Create preview
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
            
            // Append text fields
            Object.keys(formData).forEach(key => {
                if (formData[key]) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            // Append avatar if selected
            if (avatar) {
                formDataToSend.append('avatar', avatar);
            }

            // Append password data if changing password
            if (showPasswordChange && passwordData.currentPassword && passwordData.newPassword) {
                if (passwordData.newPassword !== passwordData.confirmPassword) {
                    toast.error('Mật khẩu mới không khớp!');
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
            
            toast.success('Cập nhật thông tin thành công!');
            
            // Update user in context
            if (response.data.user) {
                updateUser(response.data.user);
                // Update avatar preview
                if (response.data.user.avatar) {
                    setAvatarPreview(getAvatarUrl(response.data.user.avatar));
                }
            }
            
            // Reset password fields
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setShowPasswordChange(false);
            
            if (onUpdate) onUpdate();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Cập nhật thất bại!');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="personal-info-tab">
            <form onSubmit={handleSubmit} className="profile-form">
                {/* Avatar Upload Section */}
                <div className="avatar-section">
                    <div className="avatar-preview">
                        {avatarPreview ? (
                            <img src={avatarPreview} alt="Avatar" />
                        ) : (
                            <div className="avatar-placeholder">
                                {formData.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                    </div>
                    <div className="avatar-actions">
                        <label className="btn-upload-avatar">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                            📷 Thay đổi ảnh đại diện
                        </label>
                        <p className="avatar-hint">Kích thước tối đa: 5MB. Định dạng: JPG, PNG, GIF</p>
                    </div>
                </div>

                <div className="form-divider"></div>

                {/* Basic Information */}
                <h3 className="section-heading">Thông tin cơ bản</h3>

                <div className="form-group">
                    <label>Họ và tên *</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Nhập họ và tên"
                    />
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="username"
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@example.com"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="0912345678"
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

                <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                    />
                </div>

                <div className="form-group full-width">
                    <label>Địa chỉ</label>
                    <textarea
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Nhập địa chỉ chi tiết"
                        rows="3"
                    />
                </div>

                <div className="form-divider"></div>

                {/* Change Password Section */}
                <div className="password-section">
                    <button
                        type="button"
                        className="btn-toggle-password"
                        onClick={() => setShowPasswordChange(!showPasswordChange)}
                    >
                        {showPasswordChange ? '🔓 Ẩn đổi mật khẩu' : '🔒 Đổi mật khẩu'}
                    </button>

                    {showPasswordChange && (
                        <div className="password-fields">
                            <div className="form-group">
                                <label>Mật khẩu hiện tại *</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Mật khẩu mới *</label>
                                    <input
                                        type="password"
                                        name="newPassword"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập mật khẩu mới"
                                        minLength="6"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Xác nhận mật khẩu mới *</label>
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChange}
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="form-actions">
                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? '⏳ Đang lưu...' : '💾 Lưu thay đổi'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInfo;
