import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  UseGuards,
  Body,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('wishlist')
  @UseGuards(JwtAuthGuard)
  async getWishlist(@CurrentUser() user: any) {
    return this.usersService.getWishlist(user._id);
  }

  @Post('wishlist')
  @UseGuards(JwtAuthGuard)
  async addToWishlist(
    @CurrentUser() user: any,
    @Body('productId') productId: string,
  ) {
    return this.usersService.addToWishlist(user._id, productId);
  }

  @Delete('wishlist/:productId')
  @UseGuards(JwtAuthGuard)
  async removeFromWishlist(
    @CurrentUser() user: any,
    @Param('productId') productId: string,
  ) {
    return this.usersService.removeFromWishlist(user._id, productId);
  }

  @Delete('wishlist/clear/all')
  @UseGuards(JwtAuthGuard)
  async clearWishlist(@CurrentUser() user: any) {
    return this.usersService.clearWishlist(user._id);
  }
}
