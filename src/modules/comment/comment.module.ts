import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import CommentsController from './comment.controller';
import {
  CreateCommentHandler,
  UpdateCommentHandler,
  GetCommentsHandler,
} from './eventHandlers';
import Comment from '../../db/entities/comment.entity';
import { PostsModule } from '../post/post.module';
import { DeleteCommentHandler } from './eventHandlers/deleteComment.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule, PostsModule],
  controllers: [CommentsController],
  providers: [
    CreateCommentHandler,
    UpdateCommentHandler,
    GetCommentsHandler,
    DeleteCommentHandler,
  ],
})
export class CommentsModule {}
