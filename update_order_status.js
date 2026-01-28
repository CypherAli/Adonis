// Run this in MongoDB Compass or MongoDB shell
// Update latest order to delivered status

db.orders.updateOne(
  {}, // Get any order
  {
    $set: {
      status: 'delivered',
      actualDelivery: new Date()
    },
    $push: {
      statusHistory: {
        status: 'delivered',
        note: 'Order delivered (test)',
        timestamp: new Date()
      }
    }
  },
  { sort: { createdAt: -1 } } // Sort by latest
)
