import { LoginUserDto } from './auth.dto';
import { CreateUserDto } from './auth.dto';
import {
  Injectable,
  BadRequestException,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import { RedisService } from 'src/services/redis/redis.service';

@Injectable()
export class AuthService {
  private readonly accessJwtSecret: string;
  private readonly refreshJwtSecret: string;
  private readonly accessToketTtl: string;
  private readonly refreshTokenTtl: string;

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly redisService: RedisService,
  ) {
    this.accessJwtSecret = process.env.ACCESS_SECRET;
    this.refreshJwtSecret = process.env.REFRESH_SECRET;
    this.accessToketTtl = process.env.ACCESS_TTL;
    this.refreshTokenTtl = process.env.REFRESH_TTL;
  }

  async generateTokens(email: string) {
    const user = await this.usersService.findUserByEmail(email);

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

  async login({ email, password }: LoginUserDto) {
    const user = await this.usersService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException({
        message: 'User not found',
      });
    }

    const passwordCompared = await this.bcryptService.compare(
      password,
      user.password,
    );

    if (!passwordCompared) {
      throw new BadRequestException({
        message: 'Password is invalid',
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
      throw new NotFoundException('User with this email already created');
    }

    const user = await this.usersService.createUser({
      email,
      password,
      fullName,
    });

    if (!user) {
      throw new InternalServerErrorException('Unable create user');
    }

    const tokens = await this.generateTokens(email);

    return {
      user,
      tokens,
    };
  }

  async refresh(refreshToken: string) {
    const token = this.jwtService.verify(refreshToken, {
      secret: this.refreshJwtSecret,
    });

    const savedRefreshToken = await this.redisService.get(
      `refresh_${token.id}`,
    );

    if (savedRefreshToken !== refreshToken) {
      throw new BadRequestException({
        message: 'Refresh token is invalid',
      });
    }

    const user = await this.usersService.findUserById(token.id);

    if (!user) {
      throw new NotFoundException({
        message: 'Refresh token is invalid',
      });
    }

    return await this.generateTokens(user.email);
  }
}
