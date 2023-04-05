import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from '../../common/authGuard/jwt.strategies';

import AuthController from './auth.controller';
import { UsersCQRSModule } from '../users-cqrs/users.module';
import { BcryptModule } from '../../services/bcrypt/bcrypt.module';
import { RedisModule } from '../../services/redis/redis.module';
import {
  AuthSignInHandler,
  AuthSignUpHandler,
  RefreshTokenHandler,
} from './eventHendlers';
import User from '../../db/entities/user.entity';
import { JwtTokenModule } from '../../services/jwt/jwt.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    RedisModule,
    JwtModule.register({}),
    PassportModule,
    BcryptModule,
    JwtTokenModule,
    UsersCQRSModule,
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthSignInHandler,
    AuthSignUpHandler,
    RefreshTokenHandler,
  ],
})
export class AuthCQRSModule {}
