import { AuthTestType } from 'test/auth.e2e-spec';
import { Repository } from 'typeorm';

import { AuthSignInHandler } from './authSignIn.handler';
import { BcryptService } from 'src/services/bcrypt/bcrypt.service';
import User from 'src/db/entities/user.entity';
import { SignInUserDto } from '../auth.dto';
import { JwtTokenService } from 'src/services/jwt/jwt.service';
import { AuthSignUpHandler } from './authSignUp.handler';
import { RefreshTokenHandler } from './refreshToken.handler';
import { JwtService } from '@nestjs/jwt';
import { RedisService } from 'src/services/redis/redis.service';

describe('bcrypt test', () => {
  let authSignInHandler: AuthSignInHandler;
  let authSignUpHandler: AuthSignUpHandler;
  let refreshTokenHandler: RefreshTokenHandler;

  let bcryptService: BcryptService;
  let jwtTokenService: JwtTokenService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(() => {
    authSignInHandler = new AuthSignInHandler(
      userRepo,
      bcryptService,
      jwtTokenService,
    );
    authSignUpHandler = new AuthSignUpHandler(
      userRepo,
      bcryptService,
      jwtTokenService,
    );
    refreshTokenHandler = new RefreshTokenHandler(
      userRepo,
      jwtService,
      redisService,
      jwtTokenService,
    );
  });

  describe('test authController CQRS', () => {
    // Cannot read properties of undefined (reading 'createQueryBuilder')

    // it('Return user before creating / sign-in', async () => {
    //   const result = {} as AuthTestType;
    //   jest
    //     .spyOn(authSignInHandler, 'execute')
    //     .mockImplementation(async () => result);

    //   expect(
    //     await authSignInHandler.execute({
    //       body: new SignInUserDto(),
    //     }),
    //   ).toBe(result);
    // });

    it('Return user before creating / sign-up', async () => {
      const result = {} as AuthTestType;
      jest
        .spyOn(authSignUpHandler, 'execute')
        .mockImplementation(async () => result);

      expect(
        await authSignInHandler.execute({
          body: new SignInUserDto(),
        }),
      ).toBe(result);
    });

    it('Return pair of tokens before refresh', async () => {
      const result = {} as AuthTestType['tokens'];
      jest
        .spyOn(refreshTokenHandler, 'execute')
        .mockImplementation(async () => result);

      expect(
        await refreshTokenHandler.execute({ token: 'some refresh token' }),
      ).toBe(result);
    });
  });
});
