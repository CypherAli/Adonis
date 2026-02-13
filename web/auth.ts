import NextAuth, { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3333'

export const authConfig: NextAuthConfig = {
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Gọi API AdonisJS backend - endpoint đúng là /api/auth/login
          const response = await fetch(`${API_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials?.email,
              password: credentials?.password,
            }),
          })

          const data = await response.json()
          
          // Debug log
          console.log('Auth response status:', response.status)
          console.log('Auth response data:', JSON.stringify(data, null, 2))

          if (!response.ok) {
            console.error('Auth failed:', data.message)
            return null
          }

          const { token, user } = data

          if (token && user) {
            // Return user object với token
            // NextAuth sẽ lưu vào JWT và Session
            const authUser = {
              id: String(user.id), // Ensure id is string
              email: user.email,
              name: user.username || user.email,
              role: user.role,
              accessToken: token,
              image: user.avatar || null,
            }
            console.log('Returning auth user:', authUser)
            return authUser
          }

          console.error('Missing token or user in response')
          return null
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      },
    }),
  ],
  
  callbacks: {
    // JWT Callback: Lưu token vào JWT
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - user object có data
      if (user) {
        token.accessToken = user.accessToken
        token.role = user.role
        token.id = user.id
      }
      
      // Update session trigger (khi update profile)
      if (trigger === 'update' && session) {
        token = { ...token, ...session.user }
      }
      
      return token
    },
    
    // Session Callback: Gửi data xuống client
    async session({ session, token }) {
      // Attach token và user info vào session
      if (token) {
        session.accessToken = token.accessToken as string
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  
  pages: {
    signIn: '/auth/login',
    signOut: '/auth/logout',
    error: '/auth/error',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  
  // Debug mode for development
  debug: process.env.NODE_ENV === 'development',
  
  // Secret key - required in production
  secret: process.env.NEXTAUTH_SECRET,
  
  // Trust host for production deployments
  trustHost: true,
}

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig)
