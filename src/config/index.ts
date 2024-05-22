import 'dotenv/config';
import pkg from '../../package.json';
import { Env, Config } from '../interfaces';

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
    base_url: process.env.BASE_URL,
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
    jwt_secret: process.env.JWT_SECRET ?? '',
    /**
     *  JWT Secret Expiry
     */
    jwt_expires_in: process.env.JWT_EXPIRES_IN ?? '',
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
