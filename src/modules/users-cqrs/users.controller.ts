import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';

import { AccessGuard } from '../../common/authGuard/jwt.guards';

import {
  UpdateUserAvatarDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './users.dto';
import {
  DeleteUserProfileCommand,
  GetAllUsersCommand,
  GetUserCommand,
  UpdateUserAvatarCommand,
  UpdateUserCommand,
  UpdateUserPasswordCommand,
} from './commands/users.commands';

import User from '../../db/entities/user.entity';

@Controller('users')
@ApiTags('users')
@UseInterceptors(ClassSerializerInterceptor)
export default class UsersController {
  constructor(private commandBus: CommandBus) {}

  @ApiOperation({ description: 'Return array of users' })
  @ApiResponse({ status: 200, description: 'Return users', type: User })
  @ApiResponse({ status: 400, description: 'INTERNAL_SERVER_ERROR' })
  @Get('getAll')
  async findAll() {
    return this.commandBus.execute(new GetAllUsersCommand());
  }

  @ApiOperation({ description: 'Return user' })
  @ApiResponse({ status: 200, description: 'Return user by id', type: User })
  @ApiResponse({ status: 400, description: 'INTERNAL_SERVER_ERROR' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new GetUserCommand(id));
  }

  @ApiOperation({ description: 'Return user after update' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @ApiResponse({ status: 400, description: 'Nothing to update' })
  @ApiResponse({ status: 400, description: 'Update needs a new value' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Optional email, full name',
    type: UpdateUserDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateUserDto,
  ) {
    return this.commandBus.execute(new UpdateUserCommand(id, data));
  }

  @ApiOperation({ description: 'Return user after update password' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Your password is invalid' })
  @ApiResponse({
    status: 400,
    description: 'Password and new password must be different',
  })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Password, new password',
    type: UpdateUserPasswordDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Patch('password/:id')
  updateUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateUserPasswordDto,
  ) {
    return this.commandBus.execute(new UpdateUserPasswordCommand(id, data));
  }

  @ApiOperation({ description: 'Return true after update avatar' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBody({
    description: 'Avatar data',
    type: UpdateUserAvatarDto,
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Patch('avatar/:id')
  async updateUserAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Body(new ValidationPipe()) data: UpdateUserAvatarDto,
  ) {
    await this.commandBus.execute(new UpdateUserAvatarCommand(id, data));
  }

  @ApiOperation({ description: 'Return true after deleting user' })
  @ApiResponse({ status: 200, description: 'Return true', type: 'Boolean' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiParam({ name: 'id', type: 'number', required: true })
  @ApiBearerAuth('access-token')
  @UseGuards(AccessGuard)
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.commandBus.execute(new DeleteUserProfileCommand(id));
  }
}
