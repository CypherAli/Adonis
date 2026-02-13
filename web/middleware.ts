import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

/**
 * Middleware để protect routes và handle role-based access
 * Chạy trước mỗi request để check authentication
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get session từ NextAuth
  const session = await auth()
  
  // Public routes - không cần authentication
  const publicRoutes = ['/', '/shop', '/product', '/auth/login', '/auth/register', '/auth/error']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))
  
  // Auth routes - redirect nếu đã login
  const authRoutes = ['/auth/login', '/auth/register']
  if (session && authRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/shop', request.url))
  }
  
  // Protected routes - cần authentication
  const protectedRoutes = {
    '/checkout': ['client'],
    '/user/orders': ['client'],
    '/user/profile': ['client'],
    '/user': ['client'],
    '/admin': ['admin'],
    '/partner': ['partner'],
    '/manager': ['manager'],
  }
  
  // Check nếu route cần protect
  for (const [route, allowedRoles] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      // Chưa login → redirect to login
      if (!session) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }
      
      // Đã login nhưng không đủ quyền → redirect based on role
      const userRole = session.user?.role
      if (!allowedRoles.includes(userRole)) {
        const redirectMap: Record<string, string> = {
          admin: '/admin',
          partner: '/partner/orders',
          manager: '/manager',
          client: '/shop',
        }
        return NextResponse.redirect(new URL(redirectMap[userRole] || '/shop', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

// Config: Chỉ chạy middleware cho các routes cần thiết
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
