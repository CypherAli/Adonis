import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'

export default class AdminMiddleware {
  async handle({ session, response }: HttpContext, next: NextFn) {
    const user = session.get('user')

    if (!user || user.role !== 'admin') {
      session.flash('error', 'You do not have permission to access this page')
      return response.redirect().toRoute('admin.dashboard')
    }

    await next()
  }
}
