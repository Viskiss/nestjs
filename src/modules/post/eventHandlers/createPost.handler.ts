import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { CreatePostCommand } from '../commands/post.commands';
import Post from '../../../db/entities/post.entity';
import { UsersService } from '../../../modules/users/users.service';

@CommandHandler(CreatePostCommand)
export class CreatePostHandler implements ICommandHandler<CreatePostCommand> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
    private userService: UsersService,
  ) {}

  async execute(command: CreatePostCommand) {
    const user = await this.userService.findUserById(command.author);

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const newPost = this.postRepository.create({
      userId: command.author,
      text: command.text,
    });

    if (!newPost) {
      throw new BadRequestException({
        message: 'Unable create post',
      });
    }

    await this.postRepository.save(newPost);
    return newPost;
  }
}
