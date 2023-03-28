import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { UpdatePostCommand } from '../commands/post.commands';
import Post from '../../../db/entities/post.entity';
import { UsersService } from '../../../modules/users/users.service';

@CommandHandler(UpdatePostCommand)
export class UpdatePostHandler implements ICommandHandler<UpdatePostCommand> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UsersService,
  ) {}

  async execute(command: UpdatePostCommand) {
    const user = await this.userService.findUserById(command.author);
    const postToUpdate = await this.postRepository.findOneBy({
      id: command.body.postId,
    });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    if (!postToUpdate) {
      throw new NotFoundException({
        message: 'Post not found',
      });
    }

    if (postToUpdate.userId !== command.author) {
      throw new BadRequestException({
        message: 'You can only update your post',
      });
    }

    if (postToUpdate.text === command.body.text) {
      throw new BadRequestException({
        message: 'Need new text for update',
      });
    }

    postToUpdate.text = command.body.text;

    if (!postToUpdate) {
      throw new BadRequestException({
        message: 'Unable update post',
      });
    }

    await this.postRepository.save(postToUpdate);
    return postToUpdate;
  }
}
