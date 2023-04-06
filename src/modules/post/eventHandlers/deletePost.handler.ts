import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { DeletePostCommand } from '../commands/post.commands';

import Post from '../../../db/entities/post.entity';

@CommandHandler(DeletePostCommand)
export class DeletePostHandler implements ICommandHandler<DeletePostCommand> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async execute(command: DeletePostCommand) {
    const postToDelete = await this.postRepository.findOneBy({
      id: command.postId,
    });

    if (!postToDelete) {
      throw new NotFoundException({
        message: 'Post not found',
      });
    }

    if (postToDelete.userId !== command.userId) {
      throw new BadRequestException({
        message: 'You can only delete your post',
      });
    }

    const deleteResult = await this.postRepository.delete(command.postId);

    if (deleteResult.affected === 0) {
      throw new BadRequestException({
        message: 'Unable delete post',
      });
    }

    return true;
  }
}
