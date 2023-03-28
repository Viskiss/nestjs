import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from '../../common/authGuard/jwt.strategies';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { RedisModule } from '../../services/redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    JwtModule.register({}),
    PassportModule,
    BcryptModule,
    UsersModule,
  ],
  controllers: [AuthController],
  providers: [JwtAccessStrategy, JwtRefreshStrategy, AuthService],
})
export class AuthModule {}
