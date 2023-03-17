import { CreateUserDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
} from '@nestjs/common';

import { LoginUserDto } from './auth.dto';
import { AuthService } from './auth.service';
import { User } from '../user/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginUserDto) {
    try {
      return this.authService.login(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto) {
    try {
      return this.authService.signUp(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/refresh')
  async refresh(@Req() request: User['id'], @Body() body: string) {
    try {
      return this.authService.refresh(request, body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
