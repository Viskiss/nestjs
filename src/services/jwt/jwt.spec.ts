import { JwtService } from '@nestjs/jwt';
import User from 'src/db/entities/user.entity';
import { AuthTestType } from 'test/auth.e2e-spec';
import { Repository } from 'typeorm';
import { RedisService } from '../redis/redis.service';
import { JwtTokenService } from './jwt.service';

describe('jwt test', () => {
  let jwtTokenService: JwtTokenService;
  let userRepo: Repository<User>;
  let jwtService: JwtService;
  let redisService: RedisService;

  beforeEach(() => {
    jwtTokenService = new JwtTokenService(userRepo, jwtService, redisService);
  });

  it('Return Return pair of tokens', async () => {
    const result = {} as AuthTestType['tokens'];
    jest
      .spyOn(jwtTokenService, 'generateTokens')
      .mockImplementation(async () => result);

    expect(await jwtTokenService.generateTokens('some email')).toBe(result);
  });
});
