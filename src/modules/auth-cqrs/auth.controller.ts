import { CreateUserDto, RefreshTokenDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
  ValidationPipe,
} from '@nestjs/common';

import { SignInUserDto } from './auth.dto';

import { RefreshGuard } from '../../common/authGuard';
import { CommandBus } from '@nestjs/cqrs';
import {
  SignInCommand,
  RefreshTokenCommand,
  SignUpCommand,
} from './commands/auth.commands';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export default class AuthController {
  constructor(private commandBus: CommandBus) {}

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
    return this.commandBus.execute(new SignInCommand(body));
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
  async signUp(@Body(new ValidationPipe()) body: CreateUserDto) {
    return this.commandBus.execute(new SignUpCommand(body));
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
  async refresh(@Body(new ValidationPipe()) body: RefreshTokenDto) {
    return this.commandBus.execute(new RefreshTokenCommand(body.token));
  }
}
