import 'reflect-metadata';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

const defaultConfig = dotenv.parse(fs.readFileSync('.env'));
const localConfig = dotenv.parse(fs.readFileSync('.env'));

const mainConfig = {
  ...defaultConfig,
  ...localConfig,
};
const config = {
  postgresDb: {
    host: mainConfig.POSTGRES_DB_HOST,
    port: Number(mainConfig.POSTGRES_DB_PORT),
    user: mainConfig.POSTGRES_DB_USER,
    password: mainConfig.POSTGRES_DB_PASSWORD,
    database: mainConfig.POSTGRES_DB_NAME,
    logging: mainConfig.POSTGRES_DB_LOGGING === 'true',
  },
  verify: {
    passwordSalt: mainConfig.PASSWORD_HASH_SALT_ROUND,
    jwtSecret: mainConfig.TOKEN_SECRET,
  },
  server: {
    avatarPlace: mainConfig.CURRENT_URL,
    currentUrl: mainConfig.CURRENT_URL,
    port: mainConfig.SERVER_PORT,
    front: mainConfig.CLIENT_APP_URL,
    internalErrorMessage: mainConfig.SERVER_INTERNAL_ERROR_MESSAGE,
  },
};

export default config;
