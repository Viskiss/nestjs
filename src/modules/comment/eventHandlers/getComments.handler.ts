import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { GetCommentsCommand } from '../commands/comment.commands';

import Comment from '../../../db/entities/comment.entity';

@CommandHandler(GetCommentsCommand)
export class GetCommentsHandler implements ICommandHandler<GetCommentsCommand> {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async execute(command: GetCommentsCommand) {
    const comments = await this.commentsRepository
      .createQueryBuilder('comments')
      .where('comments.userId = :userId', { userId: command.author })
      .leftJoinAndSelect('comments.post', 'post')
      .getMany();

    if (!comments) {
      throw new BadRequestException({
        message: 'Unable get comments',
      });
    }

    return comments;
  }
}
