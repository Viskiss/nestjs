import { JwtService } from '@nestjs/jwt';

import { RedisService } from '../../services/redis/redis.service';
import { BcryptService } from '../../services/bcrypt/bcrypt.service';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { AuthTestType } from 'test/auth.e2e-spec';

describe('bcrypt test', () => {
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
  });

  describe('test authController', () => {
    it('Return user before creating / sign-up', async () => {
      const result = {} as AuthTestType;
      jest.spyOn(authService, 'signUp').mockImplementation(async () => result);

      expect(
        await authService.signUp({
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
        await authService.signIn({
          email: 'qwerty@mail.ru',
          password: '11111',
        }),
      ).toBe(result);
    });

    it('Return pair of tokens', async () => {
      const result = {} as AuthTestType['tokens'];
      jest
        .spyOn(authService, 'generateTokens')
        .mockImplementation(async () => result);

      expect(await authService.generateTokens('some email')).toBe(result);
    });

    it('Return pair of tokens before refresh', async () => {
      const result = {} as AuthTestType['tokens'];
      jest.spyOn(authService, 'refresh').mockImplementation(async () => result);

      expect(await authService.refresh('some refresh token')).toBe(result);
    });
  });
});
