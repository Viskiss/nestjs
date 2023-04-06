import { CacheModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RedisClientOptions } from 'redis';

import { RedisService } from './redis.service';

import { RedisModule } from './redis.module';

describe('redis test', () => {
  let redisService: RedisService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        RedisModule,
        ConfigModule,
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
      providers: [RedisService],
    }).compile();
    redisService = module.get<RedisService>(RedisService);
  });

  it('Return string by key from cache redis', async () => {
    const test_One = await redisService.get('some string');
    const test_Two = await redisService.get('1');

    expect(await test_One).not.toBe('');
    expect(await test_Two).toBeUndefined();
  });

  it('Return string by key from cache redis', async () => {
    const test_One = await redisService.set('some string', '');

    expect(test_One).toBeUndefined();
  });
});
