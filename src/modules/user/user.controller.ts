import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { AccessGuard } from 'src/utils/authGuard/jwt.guards';
import { UpdateUserDto, UpdateUserPasswordDto } from './user.dto';

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
  @Patch('update/:id')
  updateUser(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserDto,
  ) {
    return this.usersService.updateUser(data, id);
  }

  @UseGuards(AccessGuard)
  @Patch('update/password/:id')
  updateUserPassword(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: UpdateUserPasswordDto,
  ) {
    return this.usersService.updateUserPassword(data, id);
  }

  @UseGuards(AccessGuard)
  @Delete('delete/:id')
  deleteUser(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.deleteUser(id);
  }
}
