import { LoginUserDto } from './auth.dto';
import { CreateUserDto } from './auth.dto';
import { Injectable, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { BcryptService } from '../bcrypt/bcrypt.service';
import { UsersService } from '../user/user.service';
import config from 'src/configs/env.config';

@Injectable()
export class AuthService {
  private readonly accessJwtSecret: string;

  constructor(
    private readonly bcryptService: BcryptService,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {
    this.accessJwtSecret = config.verify.jwtSecret;
  }

  async generateToken(email: string) {
    try {
      const accessToken: string = this.jwtService.sign(
        { email },
        {
          secret: this.accessJwtSecret,
          expiresIn: `30m`,
        },
      );

      return accessToken;
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
    const token = await this.generateToken(email);

    delete user.password;

    return {
      user,
      token,
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

    const token = await this.generateToken(email);

    return {
      user,
      token,
    };
  }
}
