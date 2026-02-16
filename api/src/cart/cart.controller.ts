/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@Controller('cart')
@UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  async getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(String(user._id));
  }

  @Post()
  async addToCart(
    @CurrentUser() user: any,
    @Body() addToCartDto: AddToCartDto,
  ) {
    return this.cartService.addToCart(String(user._id), addToCartDto);
  }

  @Put(':productId/:variantSku')
  async updateCartItem(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Param('variantSku') variantSku: string,
    @Body() updateDto: UpdateCartItemDto,
  ) {
    return this.cartService.updateCartItem(
      String(user._id),
      productId,
      variantSku,
      updateDto,
    );
  }

  @Delete(':productId/:variantSku')
  async removeFromCart(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
    @Param('variantSku') variantSku: string,
  ) {
    return this.cartService.removeFromCart(
      String(user._id),
      productId,
      variantSku,
    );
  }

  @Post('clear')
  async clearCart(
    @CurrentUser() user: any,
    @Body('productIds') productIds?: string[],
  ) {
    return this.cartService.clearCart(String(user._id), productIds);
  }
}
