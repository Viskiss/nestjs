import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SignUpCommand } from '../commands/auth.commands';
import User from '../../../db/entities/user.entity';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';
import { CreateUserDto } from '../auth.dto';
import { JwtTokenService } from '../../../services/jwt/jwt.service';

@CommandHandler(SignUpCommand)
export class AuthSignUpHandler implements ICommandHandler<SignUpCommand> {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtTokenService: JwtTokenService,
  ) {}

  async createUser(body: CreateUserDto) {
    const { email, password, fullName } = body;

    const newUser = new User();

    newUser.email = email.trim().toLowerCase();
    newUser.password = await this.bcryptService.hash(password);

    newUser.fullName = fullName;

    await this.userRepository.save(newUser);

    delete newUser.password;

    return newUser;
  }

  async execute(command: SignUpCommand) {
    const userWithThisEmail = await this.userRepository.findOneBy({
      email: command.body.email,
    });

    if (userWithThisEmail) {
      throw new NotFoundException('User with this email already created');
    }

    const user = await this.createUser({
      email: command.body.email,
      password: command.body.password,
      fullName: command.body.fullName,
    });

    if (!user) {
      throw new InternalServerErrorException('Unable create user');
    }

    const tokens = await this.jwtTokenService.generateTokens(
      command.body.email,
    );

    return {
      user,
      tokens,
    };
  }
}
