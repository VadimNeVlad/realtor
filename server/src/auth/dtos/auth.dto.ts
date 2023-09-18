import {
  IsEmail,
  IsString,
  IsNotEmpty,
  Matches,
  MinLength,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserType } from '@prisma/client';

export class SignupDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @Matches(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, {
    message: 'phone must be a valid phone number',
  })
  phone: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  productKey?: string;
}

export class SigninDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}

export class GenerateProductKeyDto {
  @IsEmail()
  email: string;

  @IsEnum(UserType)
  userType: UserType;
}
