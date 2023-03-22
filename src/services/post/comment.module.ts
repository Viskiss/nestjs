import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';

import UserComment from 'src/db/entities/post.entity';
import CommentsController from './comment.controller';
import { CreateCommentHandler } from './createComment.handler';

@Module({
  imports: [TypeOrmModule.forFeature([UserComment]), CqrsModule],
  controllers: [CommentsController],
  providers: [CreateCommentHandler],
})
export class CommentsModule {}
