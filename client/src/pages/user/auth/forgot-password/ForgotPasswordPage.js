import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../../../api/axiosConfig';
import { useToast } from '../../../../components/common/Toast';
import '../styles/AuthPages.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [shake, setShake] = useState(false);
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!email) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            toast.error('Vui lòng nhập email');
            return;
        }

        setLoading(true);
        
        try {
            const response = await axios.post('/auth/forgot-password', { email });
            setSuccess(true);
            toast.success(response.data.message || 'Đã gửi mã xác nhận thành công!');
        } catch (err) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            const errorMsg = err.response?.data?.message || 'Không thể gửi mã. Vui lòng kiểm tra lại email.';
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-container">
                <div className={`auth-card ${shake ? 'shake-animation' : ''}`}>
                    <div className="auth-card-header">
                        <div className="auth-icon-wrapper">
                            <svg className="auth-icon-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 14.5V16.5M7 10.0288C7.47142 10 8.05259 10 8.8 10H15.2C15.9474 10 16.5286 10 17 10.0288M7 10.0288C6.41168 10.0647 5.99429 10.1455 5.63803 10.327C5.07354 10.6146 4.6146 11.0735 4.32698 11.638C4 12.2798 4 13.1198 4 14.8V16.2C4 17.8802 4 18.7202 4.32698 19.362C4.6146 19.9265 5.07354 20.3854 5.63803 20.673C6.27976 21 7.11984 21 8.8 21H15.2C16.8802 21 17.7202 21 18.362 20.673C18.9265 20.3854 19.3854 19.9265 19.673 19.362C20 18.7202 20 17.8802 20 16.2V14.8C20 13.1198 20 12.2798 19.673 11.638C19.3854 11.0735 18.9265 10.6146 18.362 10.327C18.0057 10.1455 17.5883 10.0647 17 10.0288M7 10.0288V8C7 5.23858 9.23858 3 12 3C14.7614 3 17 5.23858 17 8V10.0288" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                        </div>
                        <h1>{success ? 'Kiểm Tra Email' : 'Khôi Phục Mật Khẩu'}</h1>
                        <p className="auth-subtitle">
                            {success 
                                ? 'Chúng tôi đã gửi mã xác nhận cho bạn' 
                                : 'Nhập email để nhận mã khôi phục tài khoản'
                            }
                        </p>
                    </div>

                    {success ? (
                        <div className="success-message fade-in">
                            <div className="success-icon-wrapper">
                                <svg className="checkmark" viewBox="0 0 52 52">
                                    <circle className="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
                                    <path className="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
                                </svg>
                            </div>
                            <h3>Mã Đã Được Gửi!</h3>
                            <p className="success-email">
                                Kiểm tra hộp thư <strong>{email}</strong>
                            </p>
                            <div className="info-box">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                                </svg>
                                <span>Không thấy email? Kiểm tra cả thư mục Spam</span>
                            </div>
                            <Link to="/reset-password" className="btn-primary pulse">
                                <span>Nhập Mã Xác Nhận</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                </svg>
                            </Link>
                            <Link to="/login" className="back-link">
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                    <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                </svg>
                                <span>Quay lại đăng nhập</span>
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="auth-form fade-in">
                            <div className="form-group">
                                <label>
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{marginRight: '6px'}}>
                                        <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
                                    </svg>
                                    Địa chỉ email
                                </label>
                                <div className="input-wrapper">
                                    <input 
                                        type="email" 
                                        value={email} 
                                        onChange={(e) => setEmail(e.target.value)} 
                                        placeholder="ten@email.com"
                                        required 
                                        disabled={loading}
                                        className="form-input"
                                        autoFocus
                                    />
                                </div>
                            </div>

                            <button 
                                type="submit" 
                                className={`auth-submit-btn ${loading ? 'loading' : ''}`}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="btn-spinner"></span>
                                        <span>Đang gửi mã...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Gửi Mã Xác Nhận</span>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                                        </svg>
                                    </>
                                )}
                            </button>

                            <div className="auth-footer">
                                <Link to="/login" className="auth-link">
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                                    </svg>
                                    <span>Quay lại đăng nhập</span>
                                </Link>
                                <span className="divider">·</span>
                                <Link to="/register" className="auth-link">
                                    <span>Tạo tài khoản mới</span>
                                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M1 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H1zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6z"/>
                                        <path fillRule="evenodd" d="M13.5 5a.5.5 0 0 1 .5.5V7h1.5a.5.5 0 0 1 0 1H14v1.5a.5.5 0 0 1-1 0V8h-1.5a.5.5 0 0 1 0-1H13V5.5a.5.5 0 0 1 .5-.5z"/>
                                    </svg>
                                </Link>
                            </div>
                        </form>
                    )}
                </div>

                <div className="auth-security-badges">
                    <div className="security-badge">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M5.338 1.59a61.44 61.44 0 0 0-2.837.856.481.481 0 0 0-.328.39c-.554 4.157.726 7.19 2.253 9.188a10.725 10.725 0 0 0 2.287 2.233c.346.244.652.42.893.533.12.057.218.095.293.118a.55.55 0 0 0 .101.025.615.615 0 0 0 .1-.025c.076-.023.174-.061.294-.118.24-.113.547-.29.893-.533a10.726 10.726 0 0 0 2.287-2.233c1.527-1.997 2.807-5.031 2.253-9.188a.48.48 0 0 0-.328-.39c-.651-.213-1.75-.56-2.837-.855C9.552 1.29 8.531 1.067 8 1.067c-.53 0-1.552.223-2.662.524zM5.072.56C6.157.265 7.31 0 8 0s1.843.265 2.928.56c1.11.3 2.229.655 2.887.87a1.54 1.54 0 0 1 1.044 1.262c.596 4.477-.787 7.795-2.465 9.99a11.775 11.775 0 0 1-2.517 2.453 7.159 7.159 0 0 1-1.048.625c-.28.132-.581.24-.829.24s-.548-.108-.829-.24a7.158 7.158 0 0 1-1.048-.625 11.777 11.777 0 0 1-2.517-2.453C1.928 10.487.545 7.169 1.141 2.692A1.54 1.54 0 0 1 2.185 1.43 62.456 62.456 0 0 1 5.072.56z"/>
                            <path d="M10.854 5.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 7.793l2.646-2.647a.5.5 0 0 1 .708 0z"/>
                        </svg>
                        <div>
                            <strong>Bảo Mật</strong>
                            <span>Mã hóa SSL 256-bit</span>
                        </div>
                    </div>
                    <div className="security-badge">
                        <svg width="20" height="20" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71V3.5z"/>
                            <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0z"/>
                        </svg>
                        <div>
                            <strong>Nhanh Chóng</strong>
                            <span>Xử lý trong 1 giây</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
