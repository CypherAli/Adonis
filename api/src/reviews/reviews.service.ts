import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Review, ReviewDocument } from './schemas/review.schema';
import { Product, ProductDocument } from '../products/schemas/product.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  // ✅ GET USER REVIEWS WITH JOIN QUERY (populate) - không lòng vòng như cũ
  async getUserReviewsWithProducts(userId: string) {
    return this.reviewModel
      .find({ user: userId })
      .populate('product', 'name images basePrice brand category')
      .populate('user', 'name avatar')
      .populate('order', 'orderNumber')
      .sort({ createdAt: -1 })
      .exec();
  }

  // ✅ GET USER ORDERS WITH REVIEW STATUS - JOIN QUERY tối ưu
  async getUserOrdersWithReviewStatus(userId: string) {
    const orders = await this.orderModel
      .find({ user: userId })
      .populate('items.product', 'name images basePrice')
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    // Get all user's reviews in one query
    const reviews = await this.reviewModel
      .find({ user: userId })
      .select('product')
      .lean()
      .exec();

    const reviewedProductIds = new Set(
      reviews.map(r => r.product.toString())
    );

    // Mark which items have been reviewed
    const ordersWithReviewStatus = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        hasReview: reviewedProductIds.has(
          typeof item.product === 'string' ? item.product : item.product._id.toString()
        ),
      })),
    }));

    return ordersWithReviewStatus;
  }

  async getProductReviews(productId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const [reviews, total] = await Promise.all([
      this.reviewModel
        .find({ product: productId, isApproved: true })
        .populate('user', 'name avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.reviewModel.countDocuments({ product: productId, isApproved: true }),
    ]);

    return {
      reviews,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async createReview(userId: string, createReviewDto: CreateReviewDto) {
    const { productId, orderId, ...reviewData } = createReviewDto;

    // Check if product exists
    const product = await this.productModel.findById(productId);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Check if user already reviewed this product
    const existingReview = await this.reviewModel.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      throw new BadRequestException('You have already reviewed this product');
    }

    // Verify purchase if orderId provided
    let isVerifiedPurchase = false;
    if (orderId) {
      const order = await this.orderModel.findOne({
        _id: orderId,
        user: userId,
        'items.product': productId,
      });
      isVerifiedPurchase = !!order;
    }

    // Create review
    const review = await this.reviewModel.create({
      user: userId,
      product: productId,
      order: orderId,
      ...reviewData,
      isVerifiedPurchase,
      isApproved: true, // Auto-approve for now
    });

    // Update product rating
    await this.updateProductRating(productId);

    return review;
  }

  async markHelpful(reviewId: string, userId: string) {
    const review = await this.reviewModel.findById(reviewId);
    if (!review) {
      throw new NotFoundException('Review not found');
    }

    const hasMarked = review.helpfulBy.some(
      id => id.toString() === userId
    );

    if (hasMarked) {
      // Remove
      review.helpfulBy = review.helpfulBy.filter(
        id => id.toString() !== userId
      );
      review.helpfulCount = Math.max(0, review.helpfulCount - 1);
    } else {
      // Add
      review.helpfulBy.push(userId as any);
      review.helpfulCount += 1;
    }

    await review.save();
    return review;
  }

  private async updateProductRating(productId: string) {
    const reviews = await this.reviewModel.find({
      product: productId,
      isApproved: true,
    });

    if (reviews.length === 0) {
      await this.productModel.findByIdAndUpdate(productId, {
        rating: { average: 0, count: 0 },
      });
      return;
    }

    const totalRating = reviews.reduce((sum, r) => sum + r.rating, 0);
    const average = totalRating / reviews.length;

    await this.productModel.findByIdAndUpdate(productId, {
      rating: { average: Math.round(average * 10) / 10, count: reviews.length },
    });
  }
}
