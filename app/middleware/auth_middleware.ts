import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AuthMiddleware {
  async handle({ session, response }: HttpContext, next: NextFn) {
    const user = session.get('user')

    if (!user) {
      session.flash('error', 'Please login to continue')
      return response.redirect().toRoute('auth.login')
    }

    await next()
  }
}
