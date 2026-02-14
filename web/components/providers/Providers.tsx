"use client"

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from './CartProvider'
import { WishlistProvider } from './WishlistProvider'
import { ThemeProvider } from './ThemeProvider'
import { ComparisonProvider } from './ComparisonProvider'
import { PerformanceProvider } from './OptimizedProvider'
import { ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60} // Refetch session every 5 minutes instead of constantly
      refetchOnWindowFocus={false} // Disable refetch on tab focus
    >
      <PerformanceProvider>
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              <ComparisonProvider>
                {children}
              </ComparisonProvider>
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </PerformanceProvider>
    </SessionProvider>
  )
}
