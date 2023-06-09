import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { GetAllPostsCommand } from '../commands/post.commands';

import Post from '../../../db/entities/post.entity';

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsHandler implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async execute() {
    const allPosts = await this.postRepository.find();

    if (!allPosts) {
      throw new BadRequestException({
        message: 'Unable get all posts',
      });
    }
    return allPosts;
  }
}
