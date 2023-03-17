import { LoginUserDto } from './auth.dto';
import { CreateUserDto } from './auth.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../user/user.service';
import config from 'src/common/configs/env.config';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/services/redis/redis.service';

@Injectable()
export class AuthService {
  private readonly accessJwtSecret: string;
  private readonly refreshJwtSecret: string;

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    this.accessJwtSecret = config.verify.jwtSecret;
    this.refreshJwtSecret = config.verify.jwtSecret;
  }

  async generateTokens(email: string) {
    try {
      const user = await this.usersService.findUserByEmail(email);
      const accessToken: string = this.jwtService.sign(
        { email },
        {
          secret: this.accessJwtSecret,
          expiresIn: `30m`,
        },
      );
      const refreshToken: string = this.jwtService.sign(
        { email },
        {
          secret: this.accessJwtSecret,
          expiresIn: `30m`,
        },
      );

      await this.redisService.set(`refresh_${user.id}`, refreshToken);

      return {
        accessToken,
        refreshToken,
      };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.findUserByEmail(email);

    if (!user) {
      throw new BadRequestException({
        message: 'User not found',
      });
    }

    const passwordCompared = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!passwordCompared) {
      throw new BadRequestException({
        message: 'Email or password is invalid',
      });
    }
    const tokens = await this.generateTokens(email);

    delete user.password;

    return {
      user,
      tokens,
    };
  }

  async signUp({ email, password, fullName }: CreateUserDto) {
    const userWithThisEmail = await this.usersService.findUserByEmail(email);

    if (userWithThisEmail) {
      throw new BadRequestException('User with this email already created');
    }

    const user = await this.usersService.createUser({
      email,
      password,
      fullName,
    });

    const tokens = await this.generateTokens(email);

    return {
      user,
      tokens,
    };
  }

  async refresh(id: number, token: string) {
    const savedRefreshToken = await this.redisService.get(`refresh_${id}`);

    if (savedRefreshToken !== token) {
      throw new BadRequestException({
        message: 'Refresh token is invalid',
      });
    }

    const tokenPayload = await this.jwtService.verify(token, {
      secret: this.refreshJwtSecret,
    });

    console.log(tokenPayload);

    const user = await this.usersService.findUserById(id);

    if (!user) {
      throw new BadRequestException({
        message: 'Refresh token is invalid',
      });
    }

    return this.generateTokens(user.email);
  }
}
