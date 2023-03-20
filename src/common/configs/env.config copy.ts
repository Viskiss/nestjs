import { registerAs } from '@nestjs/config';
import Redis from 'ioredis';
import * as Joi from 'joi';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const database = registerAs('db', () => ({
  host: process.env.POSTGRES_DB_HOST,
  port: process.env.POSTGRES_DB_PORT,
  username: process.env.POSTGRES_DB_USER,
  password: process.env.POSTGRES_DB_PASSWORD,
  name: process.env.POSTGRES_DB_NAME,
}));

const jwt = registerAs('jwt', () => ({
  accessSecret: process.env.ACCESS_SECRET,
  refreshSecret: process.env.REFRESH_SECRET,
  accessTtl: process.env.ACCESS_TTL,
  refreshTtl: process.env.REFRESH_TTL,
}));

const redis = registerAs('redis', () => ({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
  ttl: process.env.REDIS_TTL,
}));

export const EnvConfig = {
  envFilePath: '.env',

  validationSchema: Joi.object({
    ACCESS_SECRET: Joi.string().required(),
    REFRESH_SECRET: Joi.string().required(),
    ACCESS_TTL: Joi.string().required(),
    REFRESH_TTL: Joi.string().required(),

    REDIS_HOST: Joi.string().required(),
    REDIS_PORT: Joi.string().required(),
    REDIS_TTL: Joi.number().required(),
  }),
  load: [database, jwt, redis],
  isGlobal: true,
};

new Redis(+process.env.REDIS_PORT, process.env.REDIS_HOST);
