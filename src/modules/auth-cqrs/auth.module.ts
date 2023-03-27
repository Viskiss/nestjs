import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from 'src/common/authGuard/jwt.strategies';

import AuthController from './auth.controller';
import { UsersCQRSModule } from '../users-cqrs/users.module';
import { BcryptModule } from 'src/services/bcrypt/bcrypt.module';
import { RedisModule } from 'src/services/redis/redis.module';
import { CqrsModule } from '@nestjs/cqrs';
import { AuthLogInHandler } from './eventHendlers/authLogIn.handler';
import { AuthSignUpHandler } from './eventHendlers/authSignUp.handler';
import { RefreshTokenHandler } from './eventHendlers/refreshToken.handler';
import User from 'src/db/entities/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule,
    RedisModule,
    JwtModule.register({}),
    PassportModule,
    BcryptModule,
    UsersCQRSModule,
    CqrsModule,
  ],
  controllers: [AuthController],
  providers: [
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthLogInHandler,
    AuthSignUpHandler,
    RefreshTokenHandler,
  ],
})
export class AuthCQRSModule {}
