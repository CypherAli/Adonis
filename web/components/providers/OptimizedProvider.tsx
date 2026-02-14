'use client'

import { createContext, useContext, useEffect, useState, useMemo } from 'react'
import { getOptimalConfig } from '@/lib/performance_config'

interface PerformanceContextType {
  enableAnimations: boolean
  imageQuality: number
  prefetchOnHover: boolean
  isSlowConnection: boolean
  isLowEndDevice: boolean
}

const PerformanceContext = createContext<PerformanceContextType | undefined>(undefined)

export function usePerformance() {
  const context = useContext(PerformanceContext)
  if (!context) {
    throw new Error('usePerformance must be used within PerformanceProvider')
  }
  return context
}

export function PerformanceProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState(() => getOptimalConfig())

  useEffect(() => {
    // Update config based on connection/device changes
    const updateConfig = () => {
      setConfig(getOptimalConfig())
    }

    if (typeof window !== 'undefined') {
      const connection = (navigator as any).connection || (navigator as any).mozConnection
      
      if (connection) {
        connection.addEventListener('change', updateConfig)
        return () => connection.removeEventListener('change', updateConfig)
      }
    }
  }, [])

  // Disable animations globally if needed
  useEffect(() => {
    if (typeof document !== 'undefined') {
      if (!config.ENABLE_ANIMATIONS) {
        document.body.classList.add('no-animations')
      } else {
        document.body.classList.remove('no-animations')
      }
    }
  }, [config.ENABLE_ANIMATIONS])

  const value = useMemo(
    () => ({
      enableAnimations: config.ENABLE_ANIMATIONS,
      imageQuality: config.IMAGE_QUALITY,
      prefetchOnHover: config.PREFETCH_ON_HOVER,
      isSlowConnection: config.ENABLE_ANIMATIONS === false && config.IMAGE_QUALITY === 60,
      isLowEndDevice: config.PREFETCH_ON_HOVER === false,
    }),
    [config]
  )

  return (
    <PerformanceContext.Provider value={value}>
      {children}
    </PerformanceContext.Provider>
  )
}
