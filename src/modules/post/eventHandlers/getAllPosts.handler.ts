import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import Post from 'src/db/entities/post.entity';
import { GetAllPostsCommand } from '../commands/post.commands';
import { BadRequestException } from '@nestjs/common';

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
