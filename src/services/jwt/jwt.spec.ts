/* eslint-disable @typescript-eslint/no-empty-function */
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtTokenService } from './jwt.service';
import { RedisService } from '../redis/redis.service';

import { JwtAccessStrategy, JwtRefreshStrategy } from '../../common/authGuard';

import User from '../../db/entities/user.entity';

import { repositoryMockFactory } from '../../../test/fake.testDb';
import { JwtTokenModule } from './jwt.module';

describe('jwt test', () => {
  let jwtTokenService: JwtTokenService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      providers: [
        JwtTokenModule,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        JwtTokenService,
        JwtService,
        {
          provide: RedisService,
          useValue: {
            set: () => {
              return true;
            },
          },
        },
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    })
      .overrideProvider(JwtAccessStrategy)
      .useValue({ key: 'some key' })
      .overrideProvider(JwtRefreshStrategy)
      .useValue({ key: 'some key' })
      .compile();

    jwtTokenService = module.get(JwtTokenService);

    await module.init();
  });

  it('Return Return pair of tokens', async () => {
    const email = 'some email';

    const result = await jwtTokenService.generateTokens(email);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  afterAll(async () => {
    await module.close();
  });
});
