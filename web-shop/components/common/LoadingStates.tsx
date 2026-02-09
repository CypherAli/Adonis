/**
 * Loading States Component Library
 * Based on UX Guidelines #10, #32 - Loading feedback
 */

import React from 'react'

// Skeleton Loader for content placeholders
export function Skeleton({ className = '', width, height }: {
  className?: string
  width?: string | number
  height?: string | number
}) {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded ${className}`}
      style={{
        width: width || '100%',
        height: height || '20px',
      }}
      aria-hidden="true"
    />
  )
}

// Card Skeleton for product cards
export function CardSkeleton() {
  return (
    <div className="border rounded-lg p-4 space-y-4" aria-busy="true" aria-label="Loading content">
      <Skeleton height={200} className="rounded-lg" />
      <Skeleton width="70%" height={24} />
      <Skeleton width="40%" height={20} />
      <div className="flex gap-2">
        <Skeleton width={80} height={32} />
        <Skeleton width={80} height={32} />
      </div>
    </div>
  )
}

// Loading Spinner
export function Spinner({ size = 'md', className = '' }: {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div
      className={`inline-block animate-spin rounded-full border-solid border-gray-300 border-t-primary ${sizeClasses[size]} ${className}`}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

// Loading Button (UX Guideline #32)
export function LoadingButton({
  loading,
  disabled,
  children,
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean
}) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 ${className}`}
      aria-busy={loading}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}

// Page Loading Indicator
export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="text-center">
        <Spinner size="lg" />
        <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
      </div>
    </div>
  )
}

// Content placeholder with multiple skeletons
export function ContentSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-3" aria-busy="true" aria-label="Loading content">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '60%' : '100%'}
          height={16}
        />
      ))}
    </div>
  )
}

// Table skeleton
export function TableSkeleton({ rows = 5, cols = 4 }: {
  rows?: number
  cols?: number
}) {
  return (
    <div className="space-y-2" aria-busy="true" aria-label="Loading table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <Skeleton key={colIndex} height={40} />
          ))}
        </div>
      ))}
    </div>
  )
}
