import {
  IsArray,
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsString()
  productId: string;

  @IsString()
  variantSku: string;

  @IsNumber()
  quantity: number;

  @IsNumber()
  price: number;
}

class ShippingAddressDto {
  @IsString()
  fullName: string;

  @IsString()
  phone: string;

  @IsString()
  street: string;

  @IsString()
  district: string;

  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  ward?: string;

  @IsOptional()
  @IsString()
  zipCode?: string;
}

export class CreateOrderDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  @IsOptional()
  @IsEnum(['cod', 'card', 'bank_transfer', 'ewallet'])
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
