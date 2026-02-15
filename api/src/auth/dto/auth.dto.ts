import { IsString, IsEmail, MinLength, IsOptional, IsEnum } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(['client', 'partner'])
  role?: string;

  @IsOptional()
  @IsString()
  phone?: string;
}

export class LoginDto {
  @IsString()
  username: string;  // Can be username or email

  @IsString()
  password: string;
}
