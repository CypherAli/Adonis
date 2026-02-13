import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  // ✅ GET USER REVIEWS - với JOIN query
  @Get('my-reviews')
  @UseGuards(JwtAuthGuard)
  async getMyReviews(@CurrentUser() user: any) {
    return this.reviewsService.getUserReviewsWithProducts(user._id);
  }

  // ✅ GET ORDERS WITH REVIEW STATUS - tối ưu
  @Get('orders-with-status')
  @UseGuards(JwtAuthGuard)
  async getOrdersWithReviewStatus(@CurrentUser() user: any) {
    return this.reviewsService.getUserOrdersWithReviewStatus(user._id);
  }

  @Get('product/:productId')
  async getProductReviews(
    @Param('productId') productId: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.reviewsService.getProductReviews(productId, page, limit);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createReview(
    @CurrentUser() user: any,
    @Body() createReviewDto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(user._id, createReviewDto);
  }

  @Post(':id/helpful')
  @UseGuards(JwtAuthGuard)
  async markHelpful(@CurrentUser() user: any, @Param('id') reviewId: string) {
    return this.reviewsService.markHelpful(reviewId, user._id);
  }
}
