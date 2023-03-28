import { CreateUserDto } from './auth.dto';
import { Controller, Post, Body, UseGuards } from '@nestjs/common';

import { SignInUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import { RefreshBody } from './auth.types';
import { RefreshGuard } from '../../common/authGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/sign-in')
  async signIn(@Body() body: SignInUserDto) {
    return this.authService.signIn(body);
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
