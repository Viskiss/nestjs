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

import { AuthModule } from '../auth.module';

import {
  JwtAccessStrategy,
  JwtRefreshStrategy,
} from '../../../common/authGuard';

import User from '../../../db/entities/user.entity';

import {
  fakeUser,
  repositoryMockFactory,
} from '../../../common/testing/fake.testDb';

describe('auth service test', () => {
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
        AuthModule,
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

    expect(test).rejects.toThrow('User with this email already created');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
  });

  it('Return error (user) / sign-up', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(undefined);
    jest.spyOn(usersService, 'createUser').mockResolvedValue(undefined);

    const test = authService.signUp({
      email: 'q@mail.ru',
      fullName: 'qwerty',
      password: '11111',
    });

    expect(test).rejects.toThrow('Unable create user');
    expect(test).rejects.toBeInstanceOf(InternalServerErrorException);
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
    expect(test).toBeDefined();
  });

  it('Return error (user) / sign-in', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(undefined);
    const test = authService.signIn({
      email: '1@mail.ru',
      password: '11111',
    });

    expect(test).rejects.toThrow('User not found');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
  });

  it('Return error (password) / sign-in', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);

    const test = authService.signIn({
      email: '1@mail.ru',
      password: '',
    });

    expect(test).rejects.toThrow('Password is invalid');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
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

    expect(test).rejects.toThrow('Refresh token is invalid');
    expect(test).rejects.toBeInstanceOf(BadRequestException);
  });

  it('Return error (token) / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('other token' as never);
    jest.spyOn(redisService, 'get').mockResolvedValue('some refresh token');
    jest.spyOn(usersService, 'findUserById').mockResolvedValue(undefined);

    const test = authService.refresh('some refresh token');

    expect(test).rejects.toThrow('User not found');
    expect(test).rejects.toBeInstanceOf(NotFoundException);
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

  it('Return tokens / generate  tokens', async () => {
    jest.spyOn(usersService, 'findUserByEmail').mockResolvedValue(fakeUser);
    jest
      .spyOn(jwtService, 'sign')
      .mockImplementation(() => 'some token' as never);

    const test = await authService.generateTokens('email');

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
