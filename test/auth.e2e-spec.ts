import { UsersService } from '../src/modules/users/users.service';
import { JwtService } from '@nestjs/jwt';

import { BcryptService } from '../src/services/bcrypt/bcrypt.service';
import { AuthController } from '../src/modules/auth/auth.controller';
import { AuthService } from '../src/modules/auth/auth.service';
import { RedisService } from '../src/services/redis/redis.service';
import User from 'src/db/entities/user.entity';

export type AuthTestType = {
  user: User;
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
};

describe('UsersController (e2e)', () => {
  let authController: AuthController;
  let authService: AuthService;
  let bcryptService: BcryptService;
  let jwtService: JwtService;
  let usersService: UsersService;
  let redisService: RedisService;

  beforeEach(() => {
    authService = new AuthService(
      bcryptService,
      jwtService,
      usersService,
      redisService,
    );
    authController = new AuthController(authService);
  });

  describe('test authController', () => {
    it('Return user before creating / sign-up', async () => {
      const result = {} as AuthTestType;
      jest.spyOn(authService, 'signUp').mockImplementation(async () => result);

      expect(
        await authController.signUp({
          email: 'qwerty@mail.ru',
          fullName: 'qwerty',
          password: '11111',
        }),
      ).toBe(result);
    });

    it('Return user before sign-in', async () => {
      const result = {} as AuthTestType;
      jest.spyOn(authService, 'signIn').mockImplementation(async () => result);

      expect(
        await authController.signIn({
          email: 'qwerty@mail.ru',
          password: '11111',
        }),
      ).toBe(result);
    });

    it('Return user before sign-in', async () => {
      const result = {} as AuthTestType['tokens'];
      jest.spyOn(authService, 'refresh').mockImplementation(async () => result);

      expect(
        await authController.refresh({
          token: 'some refresh token',
        }),
      ).toBe(result);
    });
  });
});
