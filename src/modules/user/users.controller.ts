import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import User from 'src/db/entities/User';
import { UpdateUserType } from 'src/types/userTypes';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('create')
  create(@Body() createUser: User, @Res() res: Response) {
    const user = this.usersService.createUser(createUser);
    res.status(HttpStatus.CREATED).json(user);
  }

  @Get('getAll')
  findAll() {
    return this.usersService.findAllUsers();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOneUser(+id);
  }

  @Patch('update/:id')
  updateUser(
    @Param('id') id: string,
    @Body() data: UpdateUserType,
    @Res() res: Response,
  ) {
    const user = this.usersService.updateUser(data);
    res.status(HttpStatus.CREATED).json(user);
  }

  catch(error: any) {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN,
      {
        cause: error,
      },
    );
  }
}
