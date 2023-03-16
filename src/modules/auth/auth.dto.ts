import { IsString, IsEmail, IsOptional } from 'class-validator';

import { IsPassword } from 'src/utils/validator/password';

export class LoginBodyDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsPassword()
  readonly password: string;
}

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsPassword()
  password: string;
}

export class RefreshBodyDto {
  @IsString()
  readonly token: string;
}
