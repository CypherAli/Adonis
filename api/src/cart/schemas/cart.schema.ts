import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type CartDocument = Cart & Document;

class CartItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  @Prop({ required: true, default: 'default' })
  variantSku: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  seller: Types.ObjectId;

  @Prop()
  sellerName: string;

  @Prop({ required: true, min: 1, default: 1 })
  quantity: number;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ type: Date, default: Date.now })
  addedAt: Date;
}

@Schema({ timestamps: true })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, unique: true })
  user: Types.ObjectId;

  @Prop({ type: [CartItem], default: [] })
  items: CartItem[];

  @Prop({ default: 0 })
  total: number;

  @Prop({ default: 0 })
  totalItems: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

// Calculate totals before saving
CartSchema.pre('save', function (next) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
  const cart = this as any;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  cart.totalItems = cart.items.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
    (sum: number, item: any) => sum + item.quantity,
    0,
  );
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  cart.total = cart.items.reduce(
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (sum: number, item: any) => sum + item.price * item.quantity,
    0,
  );
});
