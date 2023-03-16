import { CreateUserDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  HttpCode,
} from '@nestjs/common';

import { LoginBodyDto } from './auth.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async login(@Body() body: LoginBodyDto) {
    try {
      return this.authService.login(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @Post('/signup')
  @HttpCode(201)
  async signUp(@Body() body: CreateUserDto) {
    try {
      return this.authService.signUp(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
