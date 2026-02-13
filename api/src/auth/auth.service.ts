import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/schemas/user.schema';
import { RegisterDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
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

    // Find user
    const user = await this.userModel.findOne({ username });
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

  private generateToken(user: UserDocument): string {
    const payload = {
      sub: user._id,
      username: user.username,
      role: user.role,
    };
    return this.jwtService.sign(payload);
  }

  private sanitizeUser(user: UserDocument) {
    const userObj = user.toObject();
    delete userObj.password;
    return userObj;
  }
}
