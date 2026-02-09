"use client"

import React from 'react'
import './Loading.css'

interface LoadingProps {
  message?: string
  size?: 'small' | 'medium' | 'large'
}

const Loading = ({ message = 'Đang tải...', size = 'medium' }: LoadingProps) => {
  return (
    <div className={`loading-container loading-${size}`}>
      <div className="loading-spinner">
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="spinner-ring"></div>
        <div className="laptop-icon">👟</div>
      </div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  )
}

export default Loading

