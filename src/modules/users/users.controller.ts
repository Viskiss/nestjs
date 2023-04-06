import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { AccessGuard } from '../../common/authGuard/jwt.guards';

import {
  UpdateUserAvatarDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './users.dto';

import { UsersService } from './users.service';

import User from '../../db/entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ description: 'Return array of users' })
  @ApiResponse({ status: 200, description: 'Return users', type: User })
  @ApiResponse({ status: 400, description: 'INTERNAL_SERVER_ERROR' })
  @Get('getAll')
  async findAll() {
    return this.usersService.findAllUsers();
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
    return this.usersService.findUserById(id);
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
    return this.usersService.updateUser(data, id);
  }

  @ApiOperation({ description: 'Return user after update password' })
  @ApiResponse({ status: 200, description: 'Return user', type: User })
  @ApiResponse({ status: 404, description: 'User not found' })
  @ApiResponse({ status: 400, description: 'Your password is invalid' })
  @ApiResponse({ status: 401, description: 'Invalid token!' })
  @ApiResponse({
    status: 400,
    description: 'Password and new password must be different',
  })
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
    return this.usersService.updateUserPassword(data, id);
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
    return this.usersService.uploadUserAvatar(id, data);
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
    return this.usersService.deleteUser(id);
  }
}
