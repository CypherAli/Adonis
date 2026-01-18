import mongoose, { Schema, Document, Types } from 'mongoose'

interface CartItem {
  product: Types.ObjectId
  variantSku: string
  seller?: Types.ObjectId
  sellerName?: string
  quantity: number
  price: number
  addedAt: Date
}

export interface CartDocument extends Document {
  user: Types.ObjectId
  items: CartItem[]
  updatedAt?: Date
  createdAt?: Date
  total: number
  totalItems: number
}

const CartItemSchema = new Schema<CartItem>({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  variantSku: {
    type: String,
    required: true,
  },
  seller: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  sellerName: String,
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  price: {
    type: Number,
    required: true,
  },
  addedAt: {
    type: Date,
    default: Date.now,
  },
})

const CartSchema = new Schema<CartDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
)

// Virtual for total
CartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
})

// Virtual for total items
CartSchema.virtual('totalItems').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0)
})

// Ensure virtuals are included in JSON
CartSchema.set('toJSON', { virtuals: true })
CartSchema.set('toObject', { virtuals: true })

export const Cart = mongoose.model<CartDocument>('Cart', CartSchema)
