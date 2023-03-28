import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

import { UpdateUserAvatarCommand } from '../commands/users.commands';
import User from '../../../db/entities/user.entity';

@CommandHandler(UpdateUserAvatarCommand)
export class UpdateUserAvatarHandler
  implements ICommandHandler<UpdateUserAvatarCommand>
{
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateUserAvatarCommand) {
    const user = await this.userRepository.findOneBy({ id: command.id });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    user.avatar = command.body.avatar;

    await this.userRepository.save(user);

    return true;
  }
}
