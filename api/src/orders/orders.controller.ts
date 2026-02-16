/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
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
    try {
      return await this.ordersService.createOrder(
        String(user._id),
        createOrderDto,
      );
    } catch (error: unknown) {
      const err = error as Error;
      console.error('❌ Order creation error:', err.message, err.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        err.message || 'Failed to create order',
      );
    }
  }

  @Get()
  async getUserOrders(@CurrentUser() user: any) {
    return this.ordersService.getUserOrders(String(user._id));
  }

  @Get(':id')
  async getOrderById(@CurrentUser() user: any, @Param('id') orderId: string) {
    return this.ordersService.getOrderById(orderId, String(user._id));
  }
}
