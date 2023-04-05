import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import User from '../../db/entities/user.entity';
import { RedisService } from '../redis/redis.service';

@Injectable()
export class JwtTokenService {
  private readonly accessJwtSecret = 'Some secret' || process.env.ACCESS_SECRET;
  private readonly refreshJwtSecret =
    'Some secret' || process.env.REFRESH_SECRET;
  private readonly accessToketTtl = process.env.ACCESS_TTL;
  private readonly refreshTokenTtl = process.env.REFRESH_TTL;

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly redisService: RedisService,
  ) {}

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
}
