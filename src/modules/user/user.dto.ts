import { IsEmail, IsOptional, MaxLength, MinLength } from 'class-validator';
import { IsPassword } from 'src/utils/validator/password';

export class CreateUserDto {
  @IsPassword()
  password: string;

  @IsPassword()
  newPassword: string;
}

export class UpdateUserDto {
  @MinLength(5, {
    message: 'Full name is too short',
  })
  @MaxLength(50, {
    message: 'Full name is too long',
  })
  @IsEmail()
  @IsOptional()
  readonly email: string;

  @MinLength(5, {
    message: 'Full name is too short',
  })
  @MaxLength(50, {
    message: 'Full name is too long',
  })
  @IsOptional()
  readonly fullName: string;
}

export class UpdateUserPasswordDto {
  @IsPassword()
  readonly password: string;

  @MinLength(5, {
    message: 'New password name is too short',
  })
  @MaxLength(50, {
    message: 'New password name is too long',
  })
  readonly newPassword: string;
}
