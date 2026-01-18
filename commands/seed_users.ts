import { BaseCommand } from '@adonisjs/core/ace'
import type { CommandOptions } from '@adonisjs/core/types/ace'
import UserSeeder from '../database/seeders/user_seeder.js'

export default class SeedUsers extends BaseCommand {
  static commandName = 'seed:users'
  static description = 'Seed default users into database'

  static options: CommandOptions = {
    startApp: true,
  }

  async run() {
    this.logger.info('Starting user seeding...')

    try {
      const seeder = new UserSeeder()
      await seeder.run()
      this.logger.success('User seeding completed!')
    } catch (error) {
      this.logger.error('Seeding failed:', error)
      this.exitCode = 1
    }
  }
}
