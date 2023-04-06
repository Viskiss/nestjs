import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  MaxLength,
} from 'class-validator';

import { IsPassword } from '../../common/validator/password';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(50, {
    message: 'Email is too long',
  })
  @ApiProperty({
    description: 'User email',
    example: 'zaza@mail.ru',
  })
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(5, {
    message: 'Email is too short',
  })
  @ApiProperty({
    description: 'User full name',
    example: 'Aboba Boba',
  })
  fullName: string;

  @IsString()
  @IsPassword()
  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '11111',
  })
  password: string;
}

export class SignInUserDto {
  @IsString()
  @IsEmail()
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(50, {
    message: 'Email is too long',
  })
  @ApiProperty({
    description: 'User email',
    example: 'zaza@mail.ru',
  })
  email: string;

  @IsString()
  @IsPassword()
  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '11111',
  })
  password: string;
}
export class RefreshTokenDto {
  @IsString()
  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNjgwNzc0MzExLCJleHAiOjE2ODA3NzYxMTF9.q338WMk-zoGWt02d_e1T-E7Dxd0xdZVJnOXoYT6Obss',
  })
  token: string;
}
