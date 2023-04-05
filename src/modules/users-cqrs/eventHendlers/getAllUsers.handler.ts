import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { GetAllUsersCommand } from '../commands/users.commands';
import User from '../../../db/entities/user.entity';

@CommandHandler(GetAllUsersCommand)
export class GetAllUsersHandler implements ICommandHandler<GetAllUsersCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute() {
    const allUsers = await this.userRepository.find();

    if (!allUsers) {
      throw new BadRequestException({
        message: 'Unable get all users',
      });
    }
    return allUsers;
  }
}
