import mongoose, { Schema, Document, Types } from 'mongoose'

// ===== ORDER ITEM - REFERENCE BASED =====
// Chỉ lưu references (productId, variantSku)
// Khi hiển thị → populate từ Product collection
// Admin sửa/xóa product → order tự động cập nhật
interface OrderItem {
  product: Types.ObjectId // Reference to Product
  variantSku: string // Reference to variant
  quantity: number
  price: number // Giá tại thời điểm mua (để tính tổng tiền, tránh thay đổi bill)
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned'
  statusHistory?: Array<{
    status: string
    note?: string
    timestamp: Date
  }>
}

interface StatusHistory {
  status: string
  note?: string
  updatedBy?: Types.ObjectId
  timestamp: Date
}

export interface OrderDocument extends Document {
  orderNumber: string
  user: Types.ObjectId
  items: OrderItem[]
  subtotal: number
  shippingFee: number
  tax: number
  discount: number
  totalAmount: number
  status:
    | 'pending'
    | 'confirmed'
    | 'processing'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded'
    | 'returned'
  statusHistory: StatusHistory[]
  shippingAddress: {
    fullName: string
    phone: string
    address: {
      street: string
      ward?: string
      district: string
      city: string
      zipCode?: string
    }
  }
  paymentMethod: 'cod' | 'card' | 'bank_transfer' | 'ewallet'
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  paymentDetails?: {
    transactionId?: string
    paidAt?: Date
    paymentGateway?: string
  }
  notes?: string
  trackingNumber?: string
  estimatedDelivery?: Date
  actualDelivery?: Date
  cancelReason?: string
  refundAmount?: number
  refundReason?: string
  createdAt?: Date
  updatedAt?: Date
}

const OrderItemSchema = new Schema<OrderItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
    index: true, // Index để query nhanh
  },
  variantSku: {
    type: String,
    required: true,
    index: true, // Index để query nhanh
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['confirmed', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'confirmed',
  },
  statusHistory: [
    {
      status: String,
      note: String,
      timestamp: { type: Date, default: Date.now },
    },
  ],
})

const StatusHistorySchema = new Schema<StatusHistory>({
  status: {
    type: String,
    required: true,
  },
  note: String,
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
})

const OrderSchema = new Schema<OrderDocument>(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [OrderItemSchema],
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    discount: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'processing',
        'shipped',
        'delivered',
        'cancelled',
        'refunded',
        'returned',
      ],
      default: 'pending',
      index: true,
    },
    statusHistory: [StatusHistorySchema],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: {
        street: { type: String, required: true },
        ward: String,
        district: { type: String, required: true },
        city: { type: String, required: true },
        zipCode: String,
      },
    },
    paymentMethod: {
      type: String,
      enum: ['cod', 'card', 'bank_transfer', 'ewallet'],
      default: 'cod',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
      index: true,
    },
    paymentDetails: {
      transactionId: String,
      paidAt: Date,
      paymentGateway: String,
    },
    notes: String,
    trackingNumber: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    cancelReason: String,
    refundAmount: Number,
    refundReason: String,
  },
  {
    timestamps: true,
  }
)

// Generate order number before saving
OrderSchema.pre('save', async function () {
  if (!this.orderNumber) {
    const date = new Date()
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const random = Math.floor(Math.random() * 10000)
      .toString()
      .padStart(4, '0')

    this.orderNumber = `ORD-${year}${month}${day}-${random}`
  }
})

// Indexes for better query performance
OrderSchema.index({ createdAt: -1 })
OrderSchema.index({ user: 1, status: 1 })
OrderSchema.index({ 'items.seller': 1, 'status': 1 })

export const Order = mongoose.models.Order || mongoose.model<OrderDocument>('Order', OrderSchema)
