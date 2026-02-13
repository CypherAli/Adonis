import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async createOrder(
    @CurrentUser() user: any,
    @Body() createOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(user._id, createOrderDto);
  }

  @Get()
  async getUserOrders(@CurrentUser() user: any) {
    return this.ordersService.getUserOrders(user._id);
  }

  @Get(':id')
  async getOrderById(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId, user._id);
  }
}
