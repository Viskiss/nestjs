import { CreateUserDto } from './auth.dto';
import {
  Controller,
  Post,
  Body,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';

import { LoginUserDto } from './auth.dto';

import { RefreshGuard } from 'src/common/authGuard';
import { CommandBus } from '@nestjs/cqrs';
import {
  LogInCommand,
  RefreshTokenCommand,
  SignUpCommand,
} from './commands/auth.commands';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
export default class AuthController {
  constructor(private commandBus: CommandBus) {}

  @Post('/login')
  async logIn(@Body() body: LoginUserDto) {
    return this.commandBus.execute(new LogInCommand(body));
  }

  @Post('/sign-up')
  async signUp(@Body() body: CreateUserDto) {
    return this.commandBus.execute(new SignUpCommand(body));
  }

  @UseGuards(RefreshGuard)
  @Post('/refresh')
  async refresh(@Body() body: { token: string }) {
    return this.commandBus.execute(new RefreshTokenCommand(body.token));
  }
}
