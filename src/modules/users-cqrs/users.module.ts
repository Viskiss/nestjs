import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import User from 'src/db/entities/user.entity';
import UsersController from './users.controller';
import { GetAllUsersHandler } from './eventHendlers/getAllUsers.handler';
import { UpdateUserHandler } from './eventHendlers/updateUser.handler';
import { GetUserHandler } from './eventHendlers/getUser.handler';
import { BcryptModule } from 'src/services/bcrypt/bcrypt.module';
import { DeleteUserHandler } from './eventHendlers/deleteUser.handler';
import { UpdateUserAvatarHandler } from './eventHendlers/updateUserAvatar.handler';
import { UpdateUserPasswordHandler } from './eventHendlers/updateUserPassword.handler';

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
