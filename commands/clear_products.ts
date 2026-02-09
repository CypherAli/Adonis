import { BaseCommand } from '@adonisjs/core/ace'
import mongoose from 'mongoose'
import { Product } from '#models/product'

export default class ClearProducts extends BaseCommand {
  static commandName = 'clear:products'
  static description = 'Clear all products from database'

  async run() {
    console.log('  Clearing all products...')

    try {
      if (mongoose.connection.readyState !== 1) {
        const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/laptop_shop'
        await mongoose.connect(mongoUri)
        console.log('MongoDB connected')
      }

      const result = await Product.deleteMany({})
      console.log(` Deleted ${result.deletedCount} products`)

      await mongoose.disconnect()
    } catch (error) {
      console.error(' Error:', error)
    }
  }
}
