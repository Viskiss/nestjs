import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtAccessStrategy } from 'src/common/authGuard/jwt.strategies';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { BcryptModule } from 'src/services/bcrypt/bcrypt.module';
import { RedisModule } from 'src/services/redis/redis.module';

@Module({
  imports: [
    ConfigModule,
    RedisModule,
    JwtModule.register({}),
    PassportModule,
    BcryptModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [JwtAccessStrategy, AuthService],
})
export class AuthModule {}
