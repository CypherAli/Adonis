import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
  ) {}

  async getCart(userId: string) {
    let cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product')
      .populate('items.seller', 'name shopName')
      .exec();

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, variantSku, quantity, sellerId } = addToCartDto;

    // Validate product and variant
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const variant = product.variants.find(v => v.sku === variantSku);
    if (!variant) {
      throw new NotFoundException('Variant not found');
    }

    if (variant.stock < quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    // Get or create cart
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.variantSku === variantSku,
    );

    if (existingItemIndex > -1) {
      // Update quantity
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: new Types.ObjectId(productId),
        variantSku,
        seller: sellerId ? new Types.ObjectId(sellerId) : undefined,
        quantity,
        price: variant.price,
        addedAt: new Date(),
      } as any);
    }

    await cart.save();
    return this.getCart(userId);
  }

  async updateCartItem(
    userId: string,
    productId: string,
    variantSku: string,
    updateDto: UpdateCartItemDto,
  ) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const itemIndex = cart.items.findIndex(
      item =>
        item.product.toString() === productId &&
        item.variantSku === variantSku,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    // Validate stock
    const product = await this.productModel.findById(productId);
    const variant = product.variants.find(v => v.sku === variantSku);
    if (variant.stock < updateDto.quantity) {
      throw new BadRequestException('Insufficient stock');
    }

    cart.items[itemIndex].quantity = updateDto.quantity;
    await cart.save();

    return this.getCart(userId);
  }

  async removeFromCart(userId: string, productId: string, variantSku: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    cart.items = cart.items.filter(
      item =>
        !(
          item.product.toString() === productId &&
          item.variantSku === variantSku
        ),
    );

    await cart.save();
    return this.getCart(userId);
  }

  // ✅ CLEAR CART - XỬ LÝ Ở BE (theo yêu cầu)
  async clearCart(userId: string, productIds?: string[]) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    if (productIds && productIds.length > 0) {
      // Remove specific products (sau khi checkout thành công)
      cart.items = cart.items.filter(
        item => !productIds.includes(item.product.toString()),
      );
    } else {
      // Clear all items
      cart.items = [];
    }

    await cart.save();
    return { message: 'Cart cleared successfully', cart };
  }
}
