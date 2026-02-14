import type { NextConfig } from 'next'
import path from 'path'

const nextConfig: NextConfig = {
  // Fix for multiple lockfiles - set explicit workspace root
  outputFileTracingRoot: path.join(__dirname, '../'),
  
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3333',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    // Disable optimization for external images that block requests
    unoptimized: true,
  },
  // Enable React strict mode
  reactStrictMode: true,
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Reduce bundle size
  modularizeImports: {
    'lodash': {
      transform: 'lodash/{{member}}',
    },
  },
  
  // API configuration
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333',
    NEXT_PUBLIC_WS_URL: process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:3333',
  },
}

export default nextConfig
