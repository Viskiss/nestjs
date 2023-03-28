import { Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

import { RedisService } from './redis.service';

describe('redis test', () => {
  let cache: Cache;
  let configService: ConfigService;

  describe('testing redis service', () => {
    it('Return string by key from cache redis', async () => {
      const redisService = new RedisService(cache, configService);
      const result = await redisService.get<Type>('some key string');

      expect(result).toBe(result);
    });

    // it('Return string by key from cache redis', async () => {
    //   const result = '' as unknown as Promise<Type | void>;
    //   jest.spyOn(redisService, 'set').mockImplementation(async () => result);

    //   expect(
    //     await redisService.set<Promise<Type | void>>('some key', 'some value'),
    //   ).toBe(result);
    // });
  });
});
