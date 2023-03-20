import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import type { RedisClientOptions } from 'redis';

import { RedisService } from './redis.service';

@Module({
  imports: [
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
  exports: [RedisService],
})
export class RedisModule {}
