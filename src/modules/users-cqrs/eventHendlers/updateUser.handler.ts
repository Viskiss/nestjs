import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException } from '@nestjs/common';

import { UpdateUserCommand } from '../commands/users.commands';
import User from 'src/db/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async execute(command: UpdateUserCommand) {
    const user = await this.userRepository.findOneBy({ id: command.id });

    const { email, fullName } = command.body;

    if (!email && !fullName) {
      throw new BadRequestException({
        message: 'Nothing to update',
      });
    }

    if (email === user.email && fullName === user.fullName) {
      throw new BadRequestException({
        message: 'Update needs a new value',
      });
    } else {
      user.fullName = fullName || user.fullName;
      user.email = email || user.email;
      await this.userRepository.save(user);
    }

    delete user.password;

    return user;
  }
}
