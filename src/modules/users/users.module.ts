import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { BcryptModule } from '../../services/bcrypt/bcrypt.module';

import User from '../../db/entities/user.entity';

@Module({
  imports: [BcryptModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
