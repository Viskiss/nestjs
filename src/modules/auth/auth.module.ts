import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { JwtAccessStrategy } from 'src/utils/authGuard/jwt.strategies';
import { BcryptModule } from 'src/modules/bcrypt/bcrypt.module';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
    JwtModule.register({}),
    PassportModule,
    BcryptModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [JwtAccessStrategy, AuthService],
})
export class AuthModule {}
