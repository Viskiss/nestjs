import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { UpdateCommentCommand } from '../commands/comment.commands';

import Comment from '../../../db/entities/comment.entity';

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentHandler
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: UpdateCommentCommand) {
    const data = command.data;

    const comment = await this.commentsRepository.findOneBy({
      id: data.commentId,
    });

    if (!comment) {
      throw new NotFoundException({
        message: 'Comment not found',
      });
    }

    comment.content = data.content;

    await this.commentsRepository.save(comment);

    return comment;
  }
}
