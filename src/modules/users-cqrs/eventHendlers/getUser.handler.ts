import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import User from '../../../db/entities/user.entity';
import { GetUserCommand } from '../commands/users.commands';

@CommandHandler(GetUserCommand)
export class GetUserHandler implements ICommandHandler<GetUserCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(command: GetUserCommand) {
    const user = await this.userRepository.findOneBy({ id: command.id });

    if (!user) {
      throw new BadRequestException({
        message: 'Unable get user',
      });
    }
    return user;
  }
}
