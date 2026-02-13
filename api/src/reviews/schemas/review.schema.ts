import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true, index: true })
  product: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Order', index: true })
  order: Types.ObjectId;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  comment: string;

  @Prop([String])
  images: string[];

  @Prop({ default: false })
  isVerifiedPurchase: boolean;

  @Prop({ default: 0 })
  helpfulCount: number;

  @Prop({ type: [Types.ObjectId], ref: 'User', default: [] })
  helpfulBy: Types.ObjectId[];

  @Prop([String])
  pros: string[];

  @Prop([String])
  cons: string[];

  @Prop({ default: false })
  isApproved: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  moderatedBy: Types.ObjectId;

  @Prop()
  moderatedAt: Date;

  @Prop({ type: Object })
  sellerResponse: {
    comment?: string;
    respondedBy?: Types.ObjectId;
    respondedAt?: Date;
  };
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Compound index for preventing duplicate reviews
ReviewSchema.index({ product: 1, user: 1 }, { unique: true });
