import { BaseCommand } from '@adonisjs/core/ace'
import { Order } from '#models/order'
import mongoose from 'mongoose'

export default class SetOrderDelivered extends BaseCommand {
  static commandName = 'order:delivered'
  static description = 'Set order status to delivered for testing reviews'

  async run() {
    try {
      await mongoose.connect(process.env.MONGO_URI || '')
      this.logger.info('✅ MongoDB connected')

      // Get latest order
      const order = await Order.findOne().sort({ createdAt: -1 })

      if (!order) {
        this.logger.error('❌ No orders found')
        return
      }

      // Update to delivered
      order.status = 'delivered'
      order.actualDelivery = new Date()
      order.statusHistory.push({
        status: 'delivered',
        note: 'Order delivered (test)',
        timestamp: new Date(),
      })

      await order.save()

      this.logger.info(`✅ Order #${order._id} set to DELIVERED`)
      this.logger.info(`   Order contains ${order.items.length} items`)
      this.logger.info(`   Now you can test reviews!`)

      process.exit(0)
    } catch (error) {
      this.logger.error(`❌ Error: ${error.message}`)
      process.exit(1)
    }
  }
}
