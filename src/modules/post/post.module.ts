import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import UserComment from 'src/db/entities/post.entity';

import PostController from './post.controller';

import {
  CreatePostHandler,
  GetAllPostsHandler,
  DeletePostHandler,
  UpdatePostHandler,
} from './eventHandlers/index';
import { UsersModule } from 'src/modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserComment]), CqrsModule, UsersModule],
  controllers: [PostController],
  providers: [
    CreatePostHandler,
    GetAllPostsHandler,
    DeletePostHandler,
    UpdatePostHandler,
  ],
})
export class PostsModule {}
