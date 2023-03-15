import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/db/database.module';
import { UsersController } from './users.controller';
import { userProviders } from './users.providers';
import { UsersService } from './users.service';

@Module({
  imports: [DatabaseModule],
  providers: [...userProviders, UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
