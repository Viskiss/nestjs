import { CacheModule } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { RedisClientOptions } from 'redis';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import {
  AuthSignInHandler,
  AuthSignUpHandler,
  RefreshTokenHandler,
} from '../eventHendlers';

import AuthController from '../auth.controller';

import { BcryptService } from '../../../services/bcrypt/bcrypt.service';
import { JwtTokenService } from '../../../services/jwt/jwt.service';
import { RedisService } from '../../../services/redis/redis.service';

import User from '../../../db/entities/user.entity';

import { fakeUser, repositoryMockFactory } from '../../../../test/fake.testDb';

describe('authCQRS handlers test', () => {
  let signIn: AuthSignInHandler;
  let signUp: AuthSignUpHandler;
  let refresh: RefreshTokenHandler;
  let userRepository;
  let redisService: RedisService;
  let jwtTokenService: JwtTokenService;
  let jwtService: JwtService;
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
      controllers: [AuthController],
      providers: [
        BcryptService,
        JwtTokenService,
        JwtService,
        CommandBus,
        ConfigService,
        RedisService,
        AuthSignInHandler,
        AuthSignUpHandler,
        RefreshTokenHandler,
        {
          provide: getRepositoryToken(User),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();
    userRepository = module.get(getRepositoryToken(User));

    redisService = module.get(RedisService);
    jwtTokenService = module.get(JwtTokenService);
    jwtService = module.get(JwtService);

    signIn = module.get(AuthSignInHandler);
    signUp = module.get(AuthSignUpHandler);
    refresh = module.get(RefreshTokenHandler);

    await module.init();
  });

  it('Return user after sign-in (error) / sign-in', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(undefined),
    }));

    const test = signIn.execute({
      body: { email: 'qwerty@mail.ru', password: '11111' },
    });
    expect(test).rejects.toThrow('User not found');
  });

  it('Return user after sign-in (error) / sign-in', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(fakeUser),
    }));

    const test = signIn.execute({
      body: { email: 'qwerty@mail.ru', password: '22222' },
    });

    expect(test).rejects.toThrow('Password is invalid');
  });

  it('Return user after sign-in / sign-in', async () => {
    jest.spyOn(userRepository, 'createQueryBuilder').mockImplementation(() => ({
      addSelect: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      getOne: jest.fn().mockResolvedValue(fakeUser),
    }));

    jest.spyOn(jwtTokenService, 'generateTokens').mockResolvedValue({
      accessToken: 'some token',
      refreshToken: 'some token',
    });

    const test = await signIn.execute({
      body: { email: 'qwerty@mail.ru', password: '11111' },
    });

    expect(test.user).toBe(fakeUser);
    expect(test.tokens).toHaveProperty('accessToken');
    expect(test.tokens).toHaveProperty('refreshToken');
  });

  it('Return user after sign-up (error) / sign-up', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = signUp.execute({
      body: { email: 'qwerty@mail.ru', password: '11111', fullName: null },
    });

    expect(test).rejects.toThrow('User with this email already created');
  });

  it('Return user after sign-up create/ sign-up create', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);

    const test = await signUp.createUser({
      email: 'email',
      fullName: 'anme',
      password: '11111',
    });

    expect(test.email).toBe('email');
    expect(test.password).not.toBe('11111');
  });

  it('Return user after sign-up (error) / sign-up', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    jest.spyOn(signUp, 'createUser').mockResolvedValue(undefined);

    const test = signUp.execute({
      body: { email: 'qwerty@mail.ru', password: '11111', fullName: null },
    });

    expect(test).rejects.toThrow('Unable create user');
  });

  it('Return user after sign-up (error) / sign-up', async () => {
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);
    jest.spyOn(signUp, 'createUser').mockResolvedValue(fakeUser);
    jest.spyOn(jwtTokenService, 'generateTokens').mockResolvedValue({
      accessToken: 'some token',
      refreshToken: 'some token',
    });

    const test = await signUp.execute({
      body: { email: 'qwerty@mail.ru', password: '11111', fullName: null },
    });

    expect(test.user).toBe(fakeUser);
    expect(test.tokens).toHaveProperty('accessToken');
    expect(test.tokens).toHaveProperty('refreshToken');
  });

  it('Return tokens after refresh (error) / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('' as never);

    const test = refresh.execute({ token: 'some tokem' });

    expect(test).rejects.toThrow('Refresh token is invalid');
  });

  it('Return tokens after refresh (error) / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('token' as never);
    jest.spyOn(redisService, 'get').mockResolvedValue('token');
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(undefined);

    const test = refresh.execute({ token: 'token' });

    expect(test).rejects.toThrow('User not found');
  });

  it('Return tokens after refresh / refresh', async () => {
    jest.spyOn(jwtService, 'verify').mockResolvedValue('token' as never);
    jest.spyOn(redisService, 'get').mockResolvedValue('token');
    jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(fakeUser);
    jest.spyOn(jwtTokenService, 'generateTokens').mockResolvedValue({
      accessToken: 'some token',
      refreshToken: 'some token',
    });

    const test = await refresh.execute({ token: 'token' });

    expect(test.accessToken).toBe('some token');
    expect(test.refreshToken).toBe('some token');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await module.close();
  });
});
