import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type WishlistDocument = Wishlist & Document;

@Schema({ timestamps: true })
export class Wishlist {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: MongooseSchema.Types.ObjectId;

  @Prop([
    {
      product: { type: MongooseSchema.Types.ObjectId, ref: 'Product', required: true },
      addedAt: { type: Date, default: Date.now },
    },
  ])
  items: Array<{
    product: MongooseSchema.Types.ObjectId;
    addedAt: Date;
  }>;
}

export const WishlistSchema = SchemaFactory.createForClass(Wishlist);
