import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

import { IsPassword } from 'src/common/validator/password';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(50, {
    message: 'Email is too long',
  })
  email: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsPassword()
  password: string;
}

export class LoginUserDto {
  @IsString()
  @IsEmail()
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(50, {
    message: 'Email is too long',
  })
  email: string;

  @IsString()
  @IsPassword()
  password: string;
}
