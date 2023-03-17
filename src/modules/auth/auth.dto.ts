import { IsString, IsEmail, IsOptional } from 'class-validator';

import { IsPassword } from 'src/utils/validator/password';

export class CreateUserDto {
  @IsString()
  @IsEmail()
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
  readonly email: string;

  @IsString()
  @IsPassword()
  readonly password: string;
}
