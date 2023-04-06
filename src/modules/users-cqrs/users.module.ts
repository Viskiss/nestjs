import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import User from '../../db/entities/user.entity';
import UsersController from './users.controller';
import {
  GetAllUsersHandler,
  UpdateUserAvatarHandler,
  UpdateUserHandler,
  UpdateUserPasswordHandler,
  DeleteUserHandler,
  GetUserHandler,
} from './eventHendlers';

import { BcryptModule } from '../../services/bcrypt/bcrypt.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule, BcryptModule],
  controllers: [UsersController],
  providers: [
    GetAllUsersHandler,
    UpdateUserHandler,
    GetUserHandler,
    DeleteUserHandler,
    UpdateUserAvatarHandler,
    UpdateUserPasswordHandler,
  ],
})
export class UsersCQRSModule {}
