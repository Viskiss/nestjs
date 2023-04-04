import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { SignInCommand } from '../commands/auth.commands';
import User from '../../../db/entities/user.entity';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';
import { JwtTokenService } from '../../../services/jwt/jwt.service';

@CommandHandler(SignInCommand)
export class AuthSignInHandler implements ICommandHandler<SignInCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async execute(command: SignInCommand) {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: command.body.email })
      .getOne();

    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const passwordCompared = await this.bcryptService.compare(
      command.body.password,
      user.password,
    );

    if (!passwordCompared) {
      throw new BadRequestException({
        message: 'Password is invalid',
      });
    }

    const tokens = await this.jwtTokenService.generateTokens(
      command.body.email,
    );

    delete user.password;

    return {
      user,
      tokens,
    };
  }
}
