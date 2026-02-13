import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ProductDocument = Product & Document;

class ProductVariant {
  @Prop({ required: true })
  variantName: string;

  @Prop({ required: true })
  sku: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ min: 0 })
  originalPrice: number;

  @Prop({ default: 0, min: 0 })
  stock: number;

  @Prop({ type: Object })
  specifications: {
    size?: string;
    color?: string;
    material?: string;
    shoeType?: string;
    gender?: string;
  };

  @Prop({ default: true })
  isAvailable: boolean;
}

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, index: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, index: true })
  brand: string;

  @Prop({ required: true, index: true })
  category: string;

  @Prop({ required: true, min: 0 })
  basePrice: number;

  @Prop({ type: [ProductVariant], default: [] })
  variants: ProductVariant[];

  @Prop([String])
  images: string[];

  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  createdBy: Types.ObjectId;

  @Prop([String])
  features: string[];

  @Prop({ type: Object })
  warranty: {
    duration?: string;
    details?: string;
  };

  @Prop({ type: Object, default: { average: 0, count: 0 } })
  rating: {
    average: number;
    count: number;
  };

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ default: false })
  isFeatured: boolean;

  @Prop({ default: 0 })
  soldCount: number;

  @Prop({ default: 0 })
  viewCount: number;

  @Prop({ unique: true, sparse: true })
  slug: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Text indexes for search
ProductSchema.index({ name: 'text', description: 'text' });
