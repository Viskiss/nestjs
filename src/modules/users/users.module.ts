import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';

import User from '../../db/entities/user.entity';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

import { BcryptModule } from '../../services/bcrypt/bcrypt.module';

@Module({
  imports: [BcryptModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
