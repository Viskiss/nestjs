import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { LogInCommand } from '../commands/auth.commands';
import User from 'src/db/entities/user.entity';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/services/redis/redis.service';

@CommandHandler(LogInCommand)
export class AuthLogInHandler implements ICommandHandler<LogInCommand> {
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

  async execute(command: LogInCommand) {
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
    const tokens = await this.generateTokens(command.body.email);

    delete user.password;

    return {
      user,
      tokens,
    };
  }
}
