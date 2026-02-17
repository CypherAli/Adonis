/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { Order, OrderDocument } from '../orders/schemas/order.schema';
import { Review, ReviewDocument } from '../reviews/schemas/review.schema';
import { Wishlist, WishlistDocument } from '../users/schemas/wishlist.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
    @InjectModel(Review.name) private reviewModel: Model<ReviewDocument>,
    @InjectModel(Wishlist.name) private wishlistModel: Model<WishlistDocument>,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Check if user exists
    const existingUser = await this.userModel.findOne({
      $or: [{ username: registerDto.username }, { email: registerDto.email }],
    });

    if (existingUser) {
      throw new ConflictException('Username or email already exists');
    }

    // Create user
    const user = await this.userModel.create({
      ...registerDto,
      role: registerDto.role || 'client',
    });

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    // Find user by username or email
    const user = await this.userModel.findOne({
      $or: [{ username }, { email: username }],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Check if active
    if (!user.isActive) {
      throw new UnauthorizedException('Account is inactive');
    }

    // Generate token
    const token = this.generateToken(user);

    return {
      user: this.sanitizeUser(user),
      token,
    };
  }

  async validateUser(userId: string) {
    return this.userModel.findById(userId).select('-password');
  }

  async getProfile(userId: string) {
    const user = await this.userModel.findById(userId).select('-password');
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, updateData: any) {
    const allowedFields = ['name', 'phone', 'address', 'avatar'];
    const sanitized: Record<string, any> = {};

    for (const field of allowedFields) {
      if (updateData[field] !== undefined) {
        sanitized[field] = updateData[field];
      }
    }

    const user = await this.userModel
      .findByIdAndUpdate(userId, sanitized, { new: true })
      .select('-password');

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { user };
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new BadRequestException('Mật khẩu hiện tại không đúng');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Đổi mật khẩu thành công' };
  }

  async getUserStats(userId: string) {
    const [orderCount, reviewCount, wishlistDoc] = await Promise.all([
      this.orderModel.countDocuments({ user: userId }),
      this.reviewModel.countDocuments({ user: userId }),
      this.wishlistModel.findOne({ userId: new Types.ObjectId(userId) } as any).select('items').lean(),
    ]);

    return {
      orders: orderCount,
      wishlist: wishlistDoc?.items?.length || 0,
      reviews: reviewCount,
      vouchers: 0,
    };
  }

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: UserDocument) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = user.toObject();
    return userWithoutPassword;
  }
}
