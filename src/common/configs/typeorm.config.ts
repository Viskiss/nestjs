import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource } from 'typeorm';

export const dataSource: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  logging: process.env.POSTGRES_DB_LOGGING === 'true',
  synchronize: false,
  migrationsTableName: 'typeorm_migrations',
  entities: [path.normalize(`${__dirname}/entities/**/*.{ts,js}`)],
  migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
  autoLoadEntities: true,
};

export const typeOrmSourse = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  database: process.env.POSTGRES_DB_NAME,
  logging: process.env.POSTGRES_DB_LOGGING === 'true',
  synchronize: false,
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
  entities: [path.normalize(`${__dirname}/entities/**/*.{ts,js}`)],
  migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
});
