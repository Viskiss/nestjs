import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';

import { UsersService } from './users.service';
import { AccessGuard } from 'src/common/authGuard/jwt.guards';
import {
  UpdateUserAvatarDto,
  UpdateUserDto,
  UpdateUserPasswordDto,
} from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AccessGuard)
  @Get('getAll')
  async findAll() {
    return this.usersService.findAllUsers();
  }

  @UseGuards(AccessGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.findUserById(id);
  }

  @UseGuards(AccessGuard)
  @Patch(':id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(data, id);
  }

  @UseGuards(AccessGuard)
  @Patch('password/:id')
  updateUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(data, id);
  }

  @UseGuards(AccessGuard)
  @Patch('avatar/:id')
  async updateUserAvatar(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserAvatarDto,
  ) {
    await this.usersService.uploadUserAvatar(id, data.avatar);
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
    return this.usersService.deleteUser(id);
  }
}
