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
    const { items, shippingAddress, paymentMethod = 'cod', notes } = createOrderDto;

    if (!items || items.length === 0) {
      throw new BadRequestException('Order must have at least one item');
    }

    // Validate stock availability before creating order
    for (const item of items) {
      const product = await this.productModel.findById(item.productId);
      if (!product) {
        throw new BadRequestException(`Product ${item.productId} not found`);
      }
      const variant = product.variants?.find(v => v.sku === item.variantSku);
      if (variant && variant.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for ${product.name} (${item.variantSku}). Available: ${variant.stock}`,
        );
      }
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000;
    const totalAmount = subtotal + shippingFee;

    // Create order
    const order = await this.orderModel.create({
      user: userId,
      items: items.map(item => ({
        product: item.productId,
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
      statusHistory: [{
        status: 'pending',
        note: 'Order created',
        timestamp: new Date(),
      } as any],
    });

    // Auto-clear ordered items from cart on backend
    const productIds = items.map(item => item.productId);
    try {
      await this.cartService.clearCart(userId, productIds);
    } catch {
      // Cart clear failure should not fail the order
      console.warn(`Failed to clear cart for user ${userId} after order ${order._id}`);
    }

    // Decrease stock for ordered variants
    for (const item of items) {
      await this.productModel.updateOne(
        { _id: item.productId, 'variants.sku': item.variantSku },
        { $inc: { 'variants.$.stock': -item.quantity } },
      );
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
