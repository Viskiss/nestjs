import { CreateUserDto, RefreshTokenDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';

import { SignInUserDto } from './auth.dto';
import { AuthService } from './auth.service';

import { RefreshGuard } from '../../common/authGuard';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Auth (sign-in) return user with tokens' })
  @ApiResponse({ status: 200, description: 'Return user, tokens' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Password is invalid' })
  @ApiBody({
    description: 'User email, user password',
    type: SignInUserDto,
  })
  @Post('/sign-in')
  async signIn(@Body(new ValidationPipe()) body: SignInUserDto) {
    return this.authService.signIn(body);
  }

  @ApiOperation({
    description: 'Auth (sign-up) create user, return user with tokens',
  })
  @ApiResponse({ status: 200, description: 'Return user, tokens' })
  @ApiResponse({
    status: 404,
    description: 'User with this email already created',
  })
  @ApiResponse({ status: 500, description: 'Unable create user' })
  @ApiBody({
    description: 'User email, user password, optional fullName',
    type: CreateUserDto,
  })
  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.authService.signUp(body);
  }

  @ApiOperation({ description: 'Return tokens' })
  @ApiResponse({ status: 200, description: 'Return tokens' })
  @ApiResponse({ status: 400, description: 'Refresh token is invalid' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiBody({
    description: 'Refresh token',
    type: RefreshTokenDto,
  })
  @ApiBearerAuth('Use auth bearer token')
  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Body() body: RefreshTokenDto) {
    return this.authService.refresh(body.token);
  }
}
