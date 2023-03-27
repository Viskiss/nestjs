import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { SignUpCommand } from '../commands/auth.commands';
import User from 'src/db/entities/user.entity';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/services/redis/redis.service';
import { CreateUserDto } from '../auth.dto';

@CommandHandler(SignUpCommand)
export class AuthSignUpHandler implements ICommandHandler<SignUpCommand> {
  private readonly accessJwtSecret: string;
  private readonly refreshJwtSecret: string;
  private readonly accessToketTtl: string;
  private readonly refreshTokenTtl: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {
    this.accessJwtSecret = process.env.ACCESS_SECRET;
    this.refreshJwtSecret = process.env.REFRESH_SECRET;
    this.accessToketTtl = process.env.ACCESS_TTL;
    this.refreshTokenTtl = process.env.REFRESH_TTL;
  }

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

  async generateTokens(email: string) {
    const user = await this.userRepository.findOneBy({
      email,
    });

    const { id } = user;

    const accessToken: string = this.jwtService.sign(
      { id },
      {
        secret: this.accessJwtSecret,
        expiresIn: this.accessToketTtl,
      },
    );

    const refreshToken: string = this.jwtService.sign(
      { id },
      {
        secret: this.refreshJwtSecret,
        expiresIn: this.refreshTokenTtl,
      },
    );

    await this.redisService.set(`refresh_${user.id}`, refreshToken);
    return {
      accessToken,
      refreshToken,
    };
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

    const tokens = await this.generateTokens(command.body.email);

    return {
      user,
      tokens,
    };
  }
}
