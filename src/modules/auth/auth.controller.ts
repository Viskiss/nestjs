import { CreateUserDto } from './auth.dto';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { LoginUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import { RefreshBody } from './auth.types';
import { RefreshGuard } from 'src/common/authGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async signIn(@Body() body: LoginUserDto) {
    return this.authService.login(body);
  }

  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Body() body: RefreshBody) {
    return this.authService.refresh(body.token);
  }
}
