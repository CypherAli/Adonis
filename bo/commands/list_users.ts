import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import { User } from '#models/user'

export default class ListUsers extends BaseCommand {
  static commandName = 'list:users'
  static description = 'List all users in database'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    try {
      const users = await User.find().select('username email role shopName isActive isApproved')

      this.logger.info(`Found ${users.length} users:`)
      console.log('')

      users.forEach((user, index) => {
        console.log(`${index + 1}. ${user.role.toUpperCase()}`)
        console.log(`   Email: ${user.email}`)
        console.log(`   Username: ${user.username}`)
        if (user.shopName) console.log(`   Shop: ${user.shopName}`)
        console.log(`   Active: ${user.isActive ? '' : ''}`)
        if (user.role === 'partner') console.log(`   Approved: ${user.isApproved ? '' : ''}`)
        console.log('')
      })

      console.log('Note: Passwords are hashed and cannot be displayed')
      console.log('Default password format is usually: Role@123')
      console.log('Example: Admin@123, Partner@123, Customer@123')
    } catch (error) {
      this.logger.error('Failed to list users:', error)
      this.exitCode = 1
    }
  }
}
