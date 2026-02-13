import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop()
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ enum: ['client', 'partner', 'admin'], default: 'client' })
  role: string;

  @Prop()
  shopName: string;

  @Prop()
  shopDescription: string;

  @Prop({ default: true })
  isApproved: boolean;

  @Prop()
  phone: string;

  @Prop()
  avatar: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop()
  address: string;

  @Prop()
  description: string;

  @Prop({ type: Object })
  notificationSettings: {
    emailNotifications?: boolean;
    orderNotifications?: boolean;
    promotionNotifications?: boolean;
    systemNotifications?: boolean;
  };

  @Prop([
    {
      label: { type: String, enum: ['home', 'office', 'other'] },
      fullName: String,
      phone: String,
      address: {
        street: String,
        ward: String,
        district: String,
        city: String,
        zipCode: String,
      },
      isDefault: { type: Boolean, default: false },
      createdAt: { type: Date, default: Date.now },
    },
  ])
  addresses: Array<{
    label: 'home' | 'office' | 'other';
    fullName?: string;
    phone?: string;
    address: {
      street?: string;
      ward?: string;
      district?: string;
      city?: string;
      zipCode?: string;
    };
    isDefault: boolean;
    createdAt?: Date;
  }>;

  // Method to compare password
  async comparePassword(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
  }
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hash password before saving
UserSchema.pre('save', async function () {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
  const user = this as any;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
  if (!user.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  user.password = await bcrypt.hash(user.password, salt);
});

// Add method to schema
UserSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-this-alias
  const user = this as any;
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
  return bcrypt.compare(candidatePassword, user.password);
};
