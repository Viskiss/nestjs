import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';

import { IsPassword } from '../../common/validator/password';

export class CreateUserDto {
  @IsPassword()
  password: string;

  @IsPassword()
  newPassword: string;
}

export class UpdateUserDto {
  @MinLength(5, {
    message: 'Email is too short',
  })
  @MaxLength(50, {
    message: 'Email is too long',
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @MinLength(5, {
    message: 'Full name is too short',
  })
  @MaxLength(50, {
    message: 'Full name is too long',
  })
  @IsOptional()
  fullName: string;
}

export class UpdateUserPasswordDto {
  @IsPassword()
  password: string;

  @MinLength(5, {
    message: 'New password name is too short',
  })
  @MaxLength(50, {
    message: 'New password name is too long',
  })
  newPassword: string;
}

export class UpdateUserAvatarDto {
  @MinLength(5, {
    message: 'Avatar data too short',
  })
  avatar: string;
}
