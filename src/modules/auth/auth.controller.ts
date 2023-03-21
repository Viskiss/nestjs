import { CreateUserDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { LoginUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import { RefreshBody } from './auth.types';
import { RefreshGuard } from 'src/common/authGuard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  async signIn(@Body() body: LoginUserDto) {
    try {
      return this.authService.login(body);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto) {
    try {
      return this.authService.signUp(body);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.FORBIDDEN,
          error: error,
        },
        HttpStatus.FORBIDDEN,
        {
          cause: error,
        },
      );
    }
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Body() body: RefreshBody) {
    try {
      return this.authService.refresh(body.userId, body.token);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error: error,
        },
        HttpStatus.CONFLICT,
        {
          cause: error,
        },
      );
    }
  }
}
