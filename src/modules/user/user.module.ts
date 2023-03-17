import { BcryptModule } from '../bcrypt/bcrypt.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { UsersController } from './user.controller';
import { UsersService } from './user.service';
import { User } from './user.entity';
import { userProviders } from './user.providers';

@Module({
  imports: [BcryptModule, TypeOrmModule.forFeature([User])],
  providers: [UsersService, ...userProviders],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UserModule {}
