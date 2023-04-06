import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

import { IsPassword } from '../../common/validator/password';

export class UpdateUserDto {
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(50, {
    message: 'Email is too long',
  })
  @IsEmail()
  @IsOptional()
  @ApiProperty({
    description: 'User email',
    example: 'zaza@mail.ru',
  })
  email: string;

  @MinLength(5, {
    message: 'Full name is too short',
  })
  @MaxLength(50, {
    message: 'Full name is too long',
  })
  @IsOptional()
  @ApiProperty({
    description: 'User full name',
    example: 'Aboba Boba',
  })
  fullName: string;
}

export class UpdateUserPasswordDto {
  @IsPassword()
  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '11111',
  })
  password: string;

  @MinLength(5, {
    message: 'New password name is too short',
  })
  @MaxLength(50, {
    message: 'New password name is too long',
  })
  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: '22222',
  })
  newPassword: string;
}

export class UpdateUserAvatarDto {
  @MinLength(5, {
    message: 'Avatar data too short',
  })
  @ApiProperty({
    description: 'Has to match a regular expression: /^\\+[1-9]\\d{1,14}$/',
    example: 'Some avatar string location',
  })
  avatar: string;
}
