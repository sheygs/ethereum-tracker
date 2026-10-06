import { DataSourceOptions, DataSource } from 'typeorm';
import { User, Transaction } from './entities';
import { config } from '../config';
import { join } from 'node:path';

const {
  app: { env },
  database: { host, port, password, user, name },
} = config;

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host,
  port: +port,
  username: user,
  password,
  database: name,
  entities: [User, Transaction],
  logging: env === 'development',
  synchronize: env !== 'production',
  migrations: [join(__dirname, 'migrations/*{.ts,.js}')],
  ssl: process.env.POSTGRES_SSL === 'true',
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
