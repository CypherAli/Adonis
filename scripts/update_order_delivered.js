import mongoose from 'mongoose'
import { Order } from '#models/order'

async function updateOrderToDelivered() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || '')
    console.log('✅ MongoDB connected')

    // Find latest order
    const order = await Order.findOne().sort({ createdAt: -1 })

    if (!order) {
      console.log('❌ No orders found')
      process.exit(1)
    }

    console.log(`📦 Found order: ${order._id}`)
    console.log(`   Current status: ${order.status}`)

    // Update to delivered
    order.status = 'delivered'
    order.actualDelivery = new Date()
    
    if (!order.statusHistory) {
      order.statusHistory = []
    }
    
    order.statusHistory.push({
      status: 'delivered',
      note: 'Order delivered (test)',
      timestamp: new Date(),
    })

    await order.save()

    console.log('✅ Order status updated to DELIVERED!')
    console.log(`   Order ID: ${order._id}`)
    console.log(`   Items: ${order.items.length} products`)
    console.log('\n🎉 Now reload /orders page to see review buttons!')

    process.exit(0)
  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  }
}

updateOrderToDelivered()
