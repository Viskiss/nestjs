import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import UserComment from 'src/db/entities/post.entity';
import { CreateCommentCommand } from './createComment.command';

@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    @InjectRepository(UserComment)
    private commentsRepository: Repository<UserComment>,
  ) {}

  async execute(command: CreateCommentCommand) {
    console.log(command);
    const newPost = this.commentsRepository.create({
      userId: command.author,
      text: '1111',
    });
    await this.commentsRepository.save(newPost);
    return newPost;
  }
}
