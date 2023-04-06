import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { DeleteCommentCommand } from '../commands/comment.commands';

import Comment from '../../../db/entities/comment.entity';

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentHandler
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: DeleteCommentCommand) {
    const comment = await this.commentsRepository.findOneBy({
      id: command.data.commentId,
    });

    if (!comment) {
      throw new NotFoundException({
        message: 'Comment not found',
      });
    }

    if (comment.userId !== command.author) {
      throw new BadRequestException({
        message: 'You can only delete your comment',
      });
    }

    const deleteResult = await this.commentsRepository.delete(
      command.data.commentId,
    );

    if (deleteResult.affected === 0) {
      throw new BadRequestException({
        message: 'Unable delete post',
      });
    }

    return true;
  }
}
