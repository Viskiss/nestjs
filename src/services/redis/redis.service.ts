import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Cache } from 'cache-manager';

@Injectable()
export class RedisService {
  private readonly cacheTtl: string;
  constructor(
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache,
    private readonly configService: ConfigService,
  ) {
    this.cacheTtl = '100000' || this.configService.get('REDIS_TTL');
  }

  async get<T>(key: string): Promise<T> {
    return await this.cache.get(key);
  }

  async set<T>(key: string, value: string): Promise<T | void> {
    return await this.cache.set(key, value, +this.cacheTtl);
  }
}
