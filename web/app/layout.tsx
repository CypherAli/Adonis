import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import dynamic from 'next/dynamic'
import { Providers } from '@/components/providers/Providers'
import ScrollToTop from '@/components/common/ScrollToTop'
import PageTransition from '@/components/common/PageTransition'
import '@/lib/suppress-xhr-logs'
import './globals.css'
import './styles/animations.css'
import './homepage.css'
import './performance.css'

// Lazy load heavy components
const Header = dynamic(() => import('@/components/layout/Header'), {
  ssr: true,
})
const Footer = dynamic(() => import('@/components/layout/Footer'), {
  ssr: true,
})

const inter = Inter({ 
  subsets: ['latin', 'vietnamese'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: {
    default: 'Shoe Shop - Chuyên Giày Chính Hãng',
    template: '%s | Shoe Shop',
  },
  description: 'Mua giày thể thao, giày công sở chính hãng với giá tốt nhất. Giao hàng toàn quốc.',
  keywords: 'giày, giày thể thao, sneakers, giày nam, giày nữ, giày chính hãng',
  authors: [{ name: 'Shoe Shop' }],
  creator: 'Shoe Shop',
  publisher: 'Shoe Shop',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'Shoe Shop - Chuyên Giày Chính Hãng',
    description: 'Mua giày thể thao, giày công sở chính hãng với giá tốt nhất',
    url: 'http://localhost:3000',
    siteName: 'Shoe Shop',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shoe Shop - Chuyên Giày Chính Hãng',
    description: 'Mua giày thể thao, giày công sở chính hãng',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        <link rel="preconnect" href="http://localhost:3333" />
        <link rel="dns-prefetch" href="http://localhost:3333" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <Providers>
          <ScrollToTop />
          <Header />
          <PageTransition>
            <main style={{ minHeight: '70vh' }}>
              {children}
            </main>
          </PageTransition>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
