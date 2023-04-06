import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';

import { JwtAccessStrategy, JwtRefreshStrategy } from '../../common/authGuard';

import { JwtTokenService } from './jwt.service';
import { RedisService } from '../redis/redis.service';

import { JwtTokenModule } from './jwt.module';

import User from '../../db/entities/user.entity';

import { fakeUser, repositoryMockFactory } from '../../common/testing/fake.testDb';

describe('jwt test', () => {
  let jwtTokenService: JwtTokenService;
  let jwtService: JwtService;
  let userRepository;
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
    userRepository = module.get(getRepositoryToken(User));
    jwtService = module.get(JwtService);

    await module.init();
  });

  it('Return pair of tokens', async () => {
    const email = 'some email';
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    jest.spyOn(jwtService, 'sign').mockResolvedValue('token' as never);

    const result = await jwtTokenService.generateTokens(email);

    expect(result).not.toBeNull();
    expect(result).toHaveProperty('accessToken');
    expect(result).toHaveProperty('refreshToken');
  });

  afterAll(async () => {
    await module.close();
  });
});
