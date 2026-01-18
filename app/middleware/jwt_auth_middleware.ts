import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import jwt from 'jsonwebtoken'
import env from '#start/env'

export default class JwtAuthMiddleware {
  async handle({ request, response }: HttpContext, next: NextFn) {
    try {
      // Get token from header
      const authHeader = request.header('Authorization')

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.status(401).json({
          message: 'Token không hợp lệ hoặc không tồn tại',
        })
      }

      const token = authHeader.substring(7) // Remove 'Bearer ' prefix

      // Verify token
      const decoded = jwt.verify(token, env.get('JWT_SECRET', 'your-secret-key'))

      // Attach user to context
      ;(request as any).user = decoded

      await next()
    } catch (error) {
      return response.status(401).json({
        message: 'Token không hợp lệ hoặc đã hết hạn',
      })
    }
  }
}
