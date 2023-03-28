import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeleteUserProfileCommand } from '../commands/users.commands';
import { BadRequestException } from '@nestjs/common';
import User from '../../../db/entities/user.entity';

@CommandHandler(DeleteUserProfileCommand)
export class DeleteUserHandler
  implements ICommandHandler<DeleteUserProfileCommand>
{
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(command: DeleteUserProfileCommand) {
    const deleteResult = await this.userRepository.delete(command.userId);

    if (deleteResult.affected === 0) {
      throw new BadRequestException({
        message: 'Unable delete user',
      });
    }

    return true;
  }
}
