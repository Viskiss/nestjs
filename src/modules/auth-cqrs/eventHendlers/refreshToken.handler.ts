import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { RefreshTokenCommand } from '../commands/auth.commands';
import User from '../../../db/entities/user.entity';
import { RedisService } from '../../../services/redis/redis.service';
import { JwtTokenService } from '../../../services/jwt/jwt.service';

@CommandHandler(RefreshTokenCommand)
export class RefreshTokenHandler
  implements ICommandHandler<RefreshTokenCommand>
{
  private readonly refreshJwtSecret: string;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
    private readonly jwtTokenService: JwtTokenService,
  ) {
    this.refreshJwtSecret = process.env.REFRESH_SECRET;
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

    return await this.jwtTokenService.generateTokens(user.email);
  }
}
