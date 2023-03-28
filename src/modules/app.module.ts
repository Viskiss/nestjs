import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from '../common/configs/env.config';

import { dataSource } from '../db/dataSource';
import { CommentsModule } from '../modules/comment/comment.module';
import { PostsModule } from '../modules/post/post.module';

import { AuthCQRSModule } from './auth-cqrs/auth.module';
import { UsersCQRSModule } from './users-cqrs/users.module';
// import { AuthModule } from './auth/auth.module';
// import { UsersModule } from './users/users.module';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forRoot(dataSource),
    ConfigModule.forRoot(EnvConfig),
    UsersCQRSModule,
    AuthCQRSModule,
    PostsModule,
    CommentsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
