import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Wishlist, WishlistDocument } from './schemas/wishlist.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getWishlist(userId: string) {
    let wishlist = await this.wishlistModel
      .findOne({ userId: userId as any })
      .populate('items.product')
      .exec();

    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ 
        userId: userId as any, 
        items: [] 
      });
    }

    return wishlist.items.map(item => ({
      product: item.product,
      addedAt: item.addedAt,
    }));
  }

  async addToWishlist(userId: string, productId: string) {
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let wishlist = await this.wishlistModel.findOne({ userId: userId as any });
    
    if (!wishlist) {
      wishlist = await this.wishlistModel.create({ 
        userId: userId as any, 
        items: [] 
      });
    }

    const exists = wishlist.items.some(
      item => item.product.toString() === productId
    );

    if (!exists) {
      wishlist.items.push({ 
        product: productId as any, 
        addedAt: new Date() 
      });
      await wishlist.save();
    }

    return this.getWishlist(userId);
  }

  async removeFromWishlist(userId: string, productId: string) {
    const wishlist = await this.wishlistModel.findOne({ userId: userId as any });
    
    if (!wishlist) {
      throw new NotFoundException('Wishlist not found');
    }

    wishlist.items = wishlist.items.filter(
      item => item.product.toString() !== productId
    );

    await wishlist.save();
    return this.getWishlist(userId);
  }
}
