import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from '../../../../api/axiosConfig'
import { useToast } from '../../../../components/common/Toast'
import '../styles/AuthPages.css'

const ResetPasswordPage = () => {
  const [email, setEmail] = useState('')
  const [resetCode, setResetCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const toast = useToast()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match!')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const response = await axios.post('/auth/reset-password', {
        email,
        resetCode,
        newPassword,
      })

      toast.success(response.data.message || 'Password reset successful!')
      setTimeout(() => navigate('/login'), 2000)
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Could not reset password. Please try again.'
      toast.error(errorMsg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-card-header">
            <div className="auth-icon">🔑</div>
            <h1>Reset Password</h1>
            <p className="auth-subtitle">Enter verification code and new password</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label>📧 Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label>🔢 Verification Code</label>
              <input
                type="text"
                value={resetCode}
                onChange={(e) => setResetCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                disabled={loading}
                className="form-input"
                maxLength="6"
              />
              <small className="form-hint">Verification code has been sent to your email</small>
            </div>

            <div className="form-group">
              <label>🔒 New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="form-input"
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label>🔒 Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                disabled={loading}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="checkbox-container">
                <input
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                />
                <span>Show password</span>
              </label>
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-small"></span>
                  Processing...
                </>
              ) : (
                <>
                  <span>Reset Password</span>
                  <span>→</span>
                </>
              )}
            </button>

            <div className="auth-footer">
              <button className="btn-text" onClick={() => navigate('/forgot-password')}>
                ← Resend code
              </button>
              <button className="btn-text" onClick={() => navigate('/login')}>
                Back to login
              </button>
            </div>
          </form>
        </div>

        <div className="auth-features">
          <div className="feature-item">
            <span className="feature-icon">🔒</span>
            <span>Advanced encryption</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">⏱️</span>
            <span>Code valid for 15 minutes</span>
          </div>
          <div className="feature-item">
            <span className="feature-icon">✅</span>
            <span>Completely secure</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage
