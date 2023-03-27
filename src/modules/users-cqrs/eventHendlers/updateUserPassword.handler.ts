import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { UpdateUserPasswordCommand } from '../commands/users.commands';
import User from 'src/db/entities/user.entity';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';

@CommandHandler(UpdateUserPasswordCommand)
export class UpdateUserPasswordHandler
  implements ICommandHandler<UpdateUserPasswordCommand>
{
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
  ) {}

  async execute(command: UpdateUserPasswordCommand) {
    const { password, newPassword } = command.body;

    const user = await this.userRepository.findOneBy({ id: command.id });

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const userWithPassword = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: user.email })
      .getOne();

    const passwordCompared = await this.bcryptService.compare(
      password,
      userWithPassword.password,
    );

    if (!passwordCompared) {
      throw new BadRequestException({
        message: 'Your password is invalid',
      });
    }

    if (password === newPassword) {
      throw new BadRequestException({
        message: 'Password and new password must be different',
      });
    } else {
      const hashNewPassword = await this.bcryptService.hash(newPassword);

      user.password = hashNewPassword;
    }

    await this.userRepository.save(user);

    return user;
  }
}
