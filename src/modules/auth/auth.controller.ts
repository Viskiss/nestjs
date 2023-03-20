import { CreateUserDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Req,
  Get,
  UseGuards,
} from '@nestjs/common';

import { LoginUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import { RefreshBody, RequestGuard } from './auth.types';
import { AccessGuard, RefreshGuard } from 'src/common/authGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async signIn(@Body() body: LoginUserDto) {
    try {
      console.log(body);
      return this.authService.login(body);
    } catch (error) {
      console.log('body');
      throw new BadRequestException(error);
    }
  }

  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto) {
    try {
      return this.authService.signUp(body);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Body() body: RefreshBody) {
    try {
      return this.authService.refresh(body.userId, body.token);
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  @UseGuards(AccessGuard)
  @Get('/check-token')
  async checkToken(@Req() request: RequestGuard) {
    try {
      return request.userId;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }
}
