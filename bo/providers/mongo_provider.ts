import mongoose from 'mongoose'
import env from '#start/env'

export default class MongoProvider {
  async boot() {
    try {
      await mongoose.connect(env.get('MONGODB_URI'))
      console.log('MongoDB connected successfully')
    } catch (error) {
      console.error('MongoDB connection error:', error)
      throw error
    }
  }

  async shutdown() {
    await mongoose.disconnect()
  }
}
