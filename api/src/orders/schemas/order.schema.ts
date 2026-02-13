import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OrderDocument = Order & Document;

class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  product: Types.ObjectId;

  @Prop({ required: true })
  variantSku: string;

  @Prop({ required: true, min: 1 })
  quantity: number;

  @Prop({ required: true })
  price: number;

  @Prop({
    enum: [
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned',
    ],
    default: 'confirmed',
  })
  status: string;
}

class StatusHistory {
  @Prop({ required: true })
  status: string;

  @Prop()
  note: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  updatedBy: Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  timestamp: Date;
}

@Schema({ timestamps: true })
export class Order {
  @Prop({ required: true, unique: true })
  orderNumber: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItem], required: true })
  items: OrderItem[];

  @Prop({ required: true })
  subtotal: number;

  @Prop({ default: 0 })
  shippingFee: number;

  @Prop({ default: 0 })
  tax: number;

  @Prop({ default: 0 })
  discount: number;

  @Prop({ required: true })
  totalAmount: number;

  @Prop({
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
  })
  status: string;

  @Prop({ type: [StatusHistory], default: [] })
  statusHistory: StatusHistory[];

  @Prop({ type: Object, required: true })
  shippingAddress: {
    fullName: string;
    phone: string;
    address: {
      street: string;
      ward?: string;
      district: string;
      city: string;
      zipCode?: string;
    };
  };

  @Prop({ enum: ['cod', 'card', 'bank_transfer', 'ewallet'], default: 'cod' })
  paymentMethod: string;

  @Prop({ enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' })
  paymentStatus: string;

  @Prop({ type: Object })
  paymentDetails: {
    transactionId?: string;
    paidAt?: Date;
    paymentGateway?: string;
  };

  @Prop()
  notes: string;

  @Prop()
  trackingNumber: string;

  @Prop()
  estimatedDelivery: Date;

  @Prop()
  actualDelivery: Date;

  @Prop()
  cancelReason: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

// Generate order number before saving
OrderSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
  const order = this as any;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  if (!order.orderNumber) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    order.orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
  }
  next();
});
