/* eslint-disable @typescript-eslint/no-empty-function */
import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import User from '../../db/entities/user.entity';
import { JwtTokenService } from './jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from '../redis/redis.module';
import { UserRepositoryFake } from '../../../test/fake.testDb';

describe('jwt test', () => {
  let jwtTokenService: JwtTokenService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [ConfigModule, RedisModule, JwtModule.register({})],
      providers: [
        JwtTokenService,
        {
          provide: getRepositoryToken(User),
          useClass: UserRepositoryFake,
        },
      ],
    }).compile();
    jwtTokenService = module.get<JwtTokenService>(JwtTokenService);
  });

  it('Return Return pair of tokens', async () => {
    const email = 'some email';

    const result = await jwtTokenService.generateTokens(email);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
    expect(result.accessToken).toHaveLength(139);
    expect(result.refreshToken).toHaveLength(139);
  });

  afterAll(async () => {
    await module.close();
  });
});
