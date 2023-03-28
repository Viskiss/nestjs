import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import Post from '../../../db/entities/post.entity';
import { GetAllPostsCommand } from '../commands/post.commands';

@CommandHandler(GetAllPostsCommand)
export class GetAllPostsHandler implements ICommandHandler<GetAllPostsCommand> {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  async execute() {
    const allPosts = this.postRepository.find();

    if (!allPosts) {
      throw new BadRequestException({
        message: 'Unable get all posts',
      });
    }
    return allPosts;
  }
}
