import { CacheModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvConfig } from 'src/common/configs/env.config copy';

import { dataSource } from 'src/db/dataSource';
import { CommentsModule } from 'src/modules/comment/comment.module';
import { PostsModule } from 'src/modules/post/post.module';

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
