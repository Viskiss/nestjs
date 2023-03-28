import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../../db/entities/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { usersProvider } from './users.providers';

import { BcryptModule } from '../../services/bcrypt/bcrypt.module';

@Module({
  imports: [BcryptModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService, ...usersProvider],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
