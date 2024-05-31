import 'dotenv/config';
import pkg from '../../package.json';
import { Env, Config } from '../types';

export const config: Config = {
  app: {
    /**
     *  Project Name.
     */
    name: pkg.name,
    /**
     *  Package Version
     */
    version: pkg.version,
    /**
     *  Project Description.
     */
    description: pkg.description,
    /**
     *  Author.
     */
    author: pkg.author,
    /**
     *  Base URL.
     */
    baseUrl: process.env.BASE_URL,
    /**
     *  Node/App Port.
     */
    port: process.env.PORT ?? 4000,
    /**
     *  Node Environment.
     */
    env: process.env.NODE_ENV ?? Env.DEVELOPMENT,
    /**
     *  JWT Secret
     */
    jwtSecret: process.env.JWT_SECRET ?? '',
    /**
     *  JWT Secret Expiry
     */
    jwtExpiresIn: process.env.JWT_EXPIRES_IN ?? '',
    /**
     *  Socket Client
     */
    clientOrigin: process.env.CLIENT_ORIGIN ?? '',
    /**
     * RPC Base URLs
     */
    rpcBaseUrls: process.env.RPC_BASE_URLS ?? [
      'https://eth.public-rpc.com',
      'https://rpc.ankr.com/eth',
    ],

    /***
     *  Timeout
     */
    timeout: process.env.TIME_OUT ?? 8000,

    /***
     *  Auth Token
     */
    jwtToken: process.env.JWT_TOKEN ?? '',
  },
  database: {
    /**
     *  Database User
     */
    user: process.env.POSTGRES_USER ?? 'postgres',
    /**
     *  Database Password
     */
    password: process.env.POSTGRES_PASSWORD ?? '',
    /**
     *  Database Port
     */
    port: process.env.POSTGRES_PORT ?? 5432,
    /**
     *  Database Host
     */
    host: process.env.POSTGRES_HOST ?? 'localhost',
    /**
     *  Database Name
     */
    name: process.env.POSTGRES_DATABASE ?? '',
  },
};
