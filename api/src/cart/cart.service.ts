/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument */
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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

  private readonly PRODUCT_POPULATE_FIELDS =
    'name images basePrice brand category variants';

  private populateCart(query: any) {
    return query
      .populate('items.product', this.PRODUCT_POPULATE_FIELDS)
      .populate('items.seller', 'name shopName');
  }

  async getCart(userId: string) {
    let cart = await this.populateCart(
      this.cartModel.findOne({ user: userId }),
    ).exec();

    if (!cart) {
      cart = await this.cartModel.create({ user: userId, items: [] });
    }

    // Clean up null products (deleted from DB)
    const hasNullProducts = cart.items.some((item: any) => !item.product);
    if (hasNullProducts) {
      cart.items = cart.items.filter((item: any) => item.product != null);
      await cart.save();
      const refreshed = await this.populateCart(
        this.cartModel.findOne({ user: userId }),
      ).exec();
      if (refreshed) cart = refreshed;
    }

    return cart;
  }

  async addToCart(userId: string, addToCartDto: AddToCartDto) {
    const { productId, variantSku, quantity, sellerId } = addToCartDto;

    // Validate product
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    let price = product.basePrice || 0;

    // Validate variant if provided
    if (variantSku && product.variants?.length > 0) {
      const variant = product.variants.find((v) => v.sku === variantSku);
      if (!variant) {
        throw new NotFoundException('Variant not found');
      }

      if (variant.stock < quantity) {
        throw new BadRequestException('Insufficient stock');
      }

      price = variant.price;
    }

    // Get or create cart
    let cart = await this.cartModel.findOne({ user: userId });
    if (!cart) {
      cart = new this.cartModel({ user: userId, items: [] });
    }

    // Check if item already exists
    const existingItemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (item.variantSku || 'default') === (variantSku || 'default'),
    );

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: new Types.ObjectId(productId),
        variantSku: variantSku || 'default',
        seller: sellerId ? new Types.ObjectId(sellerId) : undefined,
        quantity,
        price,
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

    const targetVariantSku = variantSku || 'default';
    const itemIndex = cart.items.findIndex(
      (item) =>
        item.product.toString() === productId &&
        (item.variantSku || 'default') === targetVariantSku,
    );

    if (itemIndex === -1) {
      throw new NotFoundException('Item not found in cart');
    }

    // Validate stock
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const variant = product.variants.find((v) => v.sku === variantSku);
    if (variant && variant.stock < updateDto.quantity) {
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

    const targetVariantSku = variantSku || 'default';

    cart.items = cart.items.filter(
      (item) =>
        !(
          item.product.toString() === productId &&
          (item.variantSku || 'default') === targetVariantSku
        ),
    );

    await cart.save();
    return this.getCart(userId);
  }

  async clearCart(userId: string, productIds?: string[]) {
    if (productIds && productIds.length > 0) {
      const cart = await this.cartModel.findOne({ user: userId });
      if (!cart) return { message: 'Cart cleared successfully' };

      cart.items = cart.items.filter(
        (item) => !productIds.includes(item.product.toString()),
      );
      await cart.save();
    } else {
      await this.cartModel.deleteOne({ user: userId });
    }

    return { message: 'Cart cleared successfully' };
  }

  private async removeDuplicatesFromCart(userId: string) {
    const cart = await this.cartModel.findOne({ user: userId });
    if (!cart) return;

    const seen = new Map<string, number>();
    const uniqueItems: any[] = [];

    cart.items.forEach((item: any) => {
      let productId: string;
      if (item.product?._id) {
        productId = item.product._id.toString();
      } else if (item.product?.toString) {
        productId = item.product.toString();
      } else {
        return;
      }

      const key = `${productId}###${item.variantSku || 'default'}`;
      const existingIndex = seen.get(key);

      if (existingIndex !== undefined) {
        uniqueItems[existingIndex].quantity += item.quantity;
      } else {
        seen.set(key, uniqueItems.length);
        uniqueItems.push(item);
      }
    });

    if (uniqueItems.length < cart.items.length) {
      if (uniqueItems.length === 0 && cart.items.length > 0) {
        return cart;
      }

      cart.items = uniqueItems;
      await cart.save();

      return await this.populateCart(
        this.cartModel.findOne({ user: userId }),
      ).exec();
    }

    return cart;
  }
}
