import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

const baseDataSourceCfg: PostgresConnectionOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_DB_HOST,
  port: Number(process.env.POSTGRES_DB_PORT),
  username: 'postgres',
  password: 'postgres',
  database: 'users_db',
  logging: process.env.POSTGRES_DB_LOGGING === 'true',
  synchronize: true,
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
  entities: [path.normalize(`${__dirname}/entities/**/*.{ts,js}`)],
  migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
};

export const dataSource: TypeOrmModuleOptions = {
  ...baseDataSourceCfg,
  autoLoadEntities: true,
};

export const typeOrmSourse = new DataSource(
  baseDataSourceCfg as unknown as DataSourceOptions,
);
