import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  BadRequestException,
  CacheModule,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { RedisService } from '../../../services/redis/redis.service';
import { BcryptService } from '../../../services/bcrypt/bcrypt.service';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { fakeUser, repositoryMockFactory } from '../../../../test/fake.testDb';
import User from '../../../db/entities/user.entity';
import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from '../../../common/authGuard';

describe('authService test', () => {
  let authService: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let redisService: RedisService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CacheModule.registerAsync<RedisClientOptions>({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: () => ({
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            ttl: +process.env.REDIS_TTL,
          }),
        }),
      ],
      providers: [
        JwtService,
        BcryptService,
        AuthService,
        JwtAccessStrategy,
        JwtRefreshStrategy,
        RedisService,
        UsersService,
        ConfigService,
        {
          provide: getRepositoryToken(User),
          useFactory: () => repositoryMockFactory,
        },
      ],
    })
      .overrideProvider(JwtAccessStrategy)
      .useValue({ key: 'some key' })
      .overrideProvider(JwtRefreshStrategy)
      .useValue({ key: 'some key' })
      .compile();

    usersService = module.get<UsersService>(UsersService);
    authService = module.get(AuthService);
    jwtService = module.get(JwtService);
    redisService = module.get(RedisService);
    await module.init();
  });

  it('Return error (email) / sign-up', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);

    const test = authService.signUp({
      email: 'qwerty@mail.ru',
      fullName: 'qwerty',
      password: '11111',
    });

    expect(test).rejects.toThrow(
      new NotFoundException('User with this email already created'),
    );
  });

  it('Return error (user) / sign-up', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(undefined);
    jest.spyOn(usersService, 'createUser').mockResolvedValue(undefined);

    const test = authService.signUp({
      email: 'q@mail.ru',
      fullName: 'qwerty',
      password: '11111',
    });

    expect(test).rejects.toThrow(
      new InternalServerErrorException('Unable create user'),
    );
  });

  it('Return user after creating / sign-up', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(undefined);
    jest.spyOn(usersService, 'createUser').mockResolvedValue(fakeUser);

    jest
      .spyOn(authService, 'generateTokens')
      .mockResolvedValue({ accessToken: 'token', refreshToken: 'token' });

    const test = await authService.signUp({
      email: '1@mail.ru',
      fullName: 'qwerty',
      password: '11111',
    });

    expect(test).toStrictEqual({
      user: fakeUser,
      tokens: { accessToken: 'token', refreshToken: 'token' },
    });
  });

  it('Return error (user) / sign-in', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(undefined);
    const test = authService.signIn({
      email: '1@mail.ru',
      password: '11111',
    });

    expect(test).rejects.toThrow(new NotFoundException('User not found'));
  });

  it('Return error (password) / sign-in', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);

    const test = authService.signIn({
      email: '1@mail.ru',
      password: '',
    });

    expect(test).rejects.toThrow(
      new BadRequestException('Password is invalid'),
    );
  });

  it('Return user after auth / sign-in', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);
    jest.spyOn(authService, 'generateTokens').mockResolvedValue({
      accessToken: 'some token',
      refreshToken: 'some token',
    });

    const test = await authService.signIn({
      email: '1@mail.ru',
      password: '11111',
    });

    expect(test).toStrictEqual({
      user: fakeUser,
      tokens: { accessToken: 'some token', refreshToken: 'some token' },
    });
  });

  it('Return error (token) / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('other token' as never);

    const test = authService.refresh('some refresh token');

    expect(test).rejects.toThrow(
      new BadRequestException('Refresh token is invalid'),
    );
  });

  it('Return error (token) / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('other token' as never);
    jest.spyOn(redisService, 'get').mockResolvedValue('some refresh token');
    jest.spyOn(usersService, 'findUserById').mockResolvedValue(undefined);

    const test = authService.refresh('some refresh token');

    expect(test).rejects.toThrow(
      new NotFoundException('Refresh token is invalid'),
    );
  });

  it('Return tokens / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('other token' as never);
    jest.spyOn(redisService, 'get').mockResolvedValue('some refresh token');
    jest.spyOn(usersService, 'findUserById').mockResolvedValue(fakeUser);
    jest.spyOn(authService, 'generateTokens').mockResolvedValue({
      accessToken: 'some token',
      refreshToken: 'some token',
    });

    const test = await authService.refresh('some refresh token');

    expect(test).toStrictEqual({
      accessToken: 'some token',
      refreshToken: 'some token',
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });
});
