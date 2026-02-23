/* eslint-disable @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument, @typescript-eslint/restrict-template-expressions, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return */
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { CartService } from '../cart/cart.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    private readonly cartService: CartService,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const {
      items,
      shippingAddress,
      paymentMethod = 'cod',
      notes,
    } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    // Lấy cart từ DB — price và quantity phải lấy từ server, không tin client
    const cart = await this.cartModel
      .findOne({ user: userId })
      .populate('items.product', 'name variants')
      .exec();

    if (!cart || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty');
    }

    const cartItems = cart.items as any[];

    // Match các item được chọn với cart, lấy price/quantity từ cart
    const orderItems: any[] = items.map((requested) => {
      const cartItem = cartItems.find(
        (ci) =>
          ci.product._id.toString() === requested.productId &&
          (ci.variantSku || 'default') === (requested.variantSku || 'default'),
      );
      if (!cartItem) {
        throw new BadRequestException(
          `Item ${requested.productId} (${requested.variantSku}) not found in cart`,
        );
      }
      return cartItem;
    });

    // Validate stock
    for (const cartItem of orderItems) {
      const product = cartItem.product;
      const variant = product.variants?.find(
        (v: any) => v.sku === cartItem.variantSku,
      );
      if (variant && variant.stock < cartItem.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name} (${cartItem.variantSku}). Available: ${variant.stock}`,
        );
      }
    }

    // Calculate totals từ giá trong cart (server-side)
    const subtotal = orderItems.reduce(
      (sum: number, item) => sum + item.price * item.quantity,
      0,
    );
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    // Create order
    const order = await this.orderModel.create({
      user: userId,
      items: orderItems.map((item) => ({
        product: item.product._id,
        variantSku: item.variantSku,
        quantity: item.quantity,
        price: item.price,
        status: 'confirmed',
      })),
      subtotal,
      shippingFee,
      tax: 0,
      discount: 0,
      totalAmount,
      status: 'pending',
      shippingAddress: {
        fullName: shippingAddress.fullName,
        phone: shippingAddress.phone,
        address: {
          street: shippingAddress.street,
          ward: shippingAddress.ward,
          district: shippingAddress.district,
          city: shippingAddress.city,
          zipCode: shippingAddress.zipCode,
        },
      },
      paymentMethod,
      paymentStatus: 'pending',
      notes,
      statusHistory: [
        {
          status: 'pending',
          note: 'Order created',
          timestamp: new Date(),
        } as any,
      ],
    });

    // Xóa các item đã order khỏi cart
    const productIds: string[] = orderItems.map((item) =>
      item.product._id.toString(),
    );
    try {
      await this.cartService.clearCart(userId, productIds);
    } catch {
      console.warn(
        `Failed to clear cart for user ${userId} after order ${order._id}`,
      );
    }

    // Decrease stock
    for (const item of orderItems) {
      const result = await this.productModel.updateOne(
        {
          _id: item.product._id,
          'variants.sku': item.variantSku,
        },
        {
          $inc: {
            'variants.$.stock': -item.quantity,
            soldCount: item.quantity,
          },
        },
      );
      if (result.matchedCount === 0) {
        console.warn(
          `Stock decrement skipped: variant "${item.variantSku}" not found in product ${item.product._id}`,
        );
      }
    }

    return order;
  }

  async getUserOrders(userId: string) {
    return this.orderModel
      .find({ user: userId })
      .populate('items.product', 'name images basePrice category brand')
      .sort({ createdAt: -1 })
      .exec();
  }

  async getOrderById(orderId: string, userId?: string) {
    const query: any = { _id: orderId };
    if (userId) query.user = userId;

    return this.orderModel
      .findOne(query)
      .populate('items.product')
      .populate('user', 'name email phone')
      .exec();
  }
}
