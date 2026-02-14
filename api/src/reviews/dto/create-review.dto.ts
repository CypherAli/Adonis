import {
  IsString,
  IsNumber,
  Min,
  Max,
  IsArray,
  IsOptional,
} from 'class-validator';

export class CreateReviewDto {
  @IsString()
  productId: string;

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsString()
  title: string;

  @IsString()
  comment: string;

  @IsOptional()
  @IsArray()
  images?: string[];

  @IsOptional()
  @IsArray()
  pros?: string[];

  @IsOptional()
  @IsArray()
  cons?: string[];
}
