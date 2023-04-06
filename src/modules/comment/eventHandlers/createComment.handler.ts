import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CreateCommentCommand } from '../commands/comment.commands';

import Comment from '../../../db/entities/comment.entity';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    const data = command.data;

    const newComment = this.commentsRepository.create({
      content: data.content,
      userId: command.author,
      postId: data.postId,
    });

    if (!newComment) {
      throw new BadRequestException({
        message: 'Unable create new comment',
      });
    }

    await this.commentsRepository.save(newComment);

    return newComment;
  }
}
