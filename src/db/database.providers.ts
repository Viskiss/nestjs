import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';
import config from '../common/configs/env.config';

dotenv.config();

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: config.postgresDb.host,
        port: config.postgresDb.port,
        username: config.postgresDb.user,
        password: config.postgresDb.password,
        database: config.postgresDb.database,
        logging: config.postgresDb.logging,
        synchronize: false,
        subscribers: [],
        migrationsTableName: 'typeorm_migrations',
        entities: [path.normalize(`${__dirname}/entities/**/*.{ts,js}`)],
        migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
      });

      return dataSource.initialize();
    },
  },
];

const dataSource = new DataSource({
  type: 'postgres',
  host: config.postgresDb.host,
  port: config.postgresDb.port,
  username: config.postgresDb.user,
  password: config.postgresDb.password,
  database: config.postgresDb.database,
  logging: config.postgresDb.logging,
  synchronize: false,
  subscribers: [],
  migrationsTableName: 'typeorm_migrations',
  entities: [path.normalize(`${__dirname}src/**/*.entity.ts`)],
  migrations: [path.normalize(`${__dirname}/migrations/*.{ts,js}`)],
});

export default dataSource;
