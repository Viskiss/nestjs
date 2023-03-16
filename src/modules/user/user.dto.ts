import { IsString } from 'class-validator';
import { IsPassword } from 'src/utils/validator/password';

export class CreateUserDto {
  @IsString()
  @IsPassword()
  password: string;

  @IsString()
  @IsPassword()
  newPassword: string;
}
