import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from '../../db/entities/user.entity';

import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from '../../common/authGuard/jwt.strategies';

import { RedisModule } from '../../services/redis/redis.module';
import { JwtTokenService } from './jwt.service';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [JwtTokenService, JwtAccessStrategy, JwtRefreshStrategy],
  exports: [JwtTokenService],
})
export class JwtTokenModule {}
