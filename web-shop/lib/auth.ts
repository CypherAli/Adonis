/**
 * Auth Module - Re-export from root auth.ts
 * @description Central auth configuration using NextAuth v5 with AdonisJS backend
 * 
 * API Endpoint: /api/auth/login (AdonisJS backend)
 * Session Strategy: JWT
 */

// Re-export everything from root auth.ts
export { handlers, auth, signIn, signOut, authConfig } from '@/auth'
