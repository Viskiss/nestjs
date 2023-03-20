import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from 'src/common/configs/env.config copy';

import { dataSource } from 'src/common/configs/typeorm.config';

import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot(dataSource),
    ConfigModule.forRoot(EnvConfig),
    UsersModule,
    AuthModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
