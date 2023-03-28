import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { AccessGuard } from '../../common/authGuard/jwt.guards';
import {
  UpdateUserAvatarDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './users.dto';
import { CommandBus } from '@nestjs/cqrs';
import {
  DeleteUserProfileCommand,
  GetAllUsersCommand,
  GetUserCommand,
  UpdateUserAvatarCommand,
  UpdateUserCommand,
  UpdateUserPasswordCommand,
} from './commands/users.commands';

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export default class UsersController {
  constructor(private commandBus: CommandBus) {}

  @UseGuards(AccessGuard)
  @Get('getAll')
  async findAll() {
    return this.commandBus.execute(new GetAllUsersCommand());
  }

  @UseGuards(AccessGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new GetUserCommand(id));
  }

  @UseGuards(AccessGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, data));
  }

  @UseGuards(AccessGuard)
  @Patch('password/:id')
  updateUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserPasswordDto,
  ) {
    return this.commandBus.execute(new UpdateUserPasswordCommand(id, data));
  }

  @UseGuards(AccessGuard)
  @Patch('avatar/:id')
  async updateUserAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserAvatarDto,
  ) {
    await this.commandBus.execute(new UpdateUserAvatarCommand(id, data));
    throw new HttpException(
      {
        status: HttpStatus.CREATED,
        error: 'Avatar set successfully',
      },
      HttpStatus.CREATED,
    );
  }

  @UseGuards(AccessGuard)
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteUserProfileCommand(id));
  }
}
