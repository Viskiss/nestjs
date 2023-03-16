import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { UpdateUserType } from 'src/modules/user/user.types';
import { UsersService } from './user.service';
import { AccessGuard } from 'src/utils/authGuard/jwt.guards';

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
  findOne(@Param('id') id: string) {
    return this.usersService.findUserById(+id);
  }

  @UseGuards(AccessGuard)
  @Patch('update/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserType,
    @Res() res: Response,
  ) {
    const user = this.usersService.updateUser(data);
    res.status(HttpStatus.CREATED).json(user);
  }

  @UseGuards(AccessGuard)
  @Patch('update/:id')
  updateUserPassword(
    @Param('id') id: string,
    @Body() data: UpdateUserType,
    @Res() res: Response,
  ) {
    const user = this.usersService.updateUser(data);
    res.status(HttpStatus.CREATED).json(user);
  }
}
