import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';
import { Cart, CartDocument } from '../cart/schemas/cart.schema';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Cart.name) private cartModel: Model<CartDocument>,
  ) {}

  async createOrder(userId: string, createOrderDto: CreateOrderDto) {
    const { items, shippingAddress, paymentMethod = 'cod', notes } = createOrderDto;

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingFee = subtotal > 500000 ? 0 : 30000; // Free shipping above 500k
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
      paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
      notes,
      statusHistory: [{
        status: 'pending',
        note: 'Order created',
        timestamp: new Date(),
      } as any],
    });

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

