import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';

import { RefreshTokenCommand } from '../commands/auth.commands';
import User from 'src/db/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/services/redis/redis.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  private readonly accessJwtSecret: string;
  private readonly refreshJwtSecret: string;
  private readonly accessToketTtl: string;
  private readonly refreshTokenTtl: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
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

  async execute(command: RefreshTokenCommand) {
    const token = this.jwtService.verify(command.token, {
      secret: this.refreshJwtSecret,
    });

    const savedRefreshToken = await this.redisService.get(
      `refresh_${token.id}`,
    );

    if (savedRefreshToken !== command.token) {
      throw new BadRequestException({
        message: 'Refresh token is invalid',
      });
    }

    const user = await this.userRepository.findOneBy({ id: token.id });

    if (!user) {
      throw new NotFoundException({
        message: 'Refresh token is invalid',
      });
    }

    return await this.generateTokens(user.email);
  }
}
