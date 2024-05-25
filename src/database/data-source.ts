import { DataSourceOptions, DataSource } from 'typeorm';
import { User, Transaction } from './entities';
import { config } from '../config';

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
  migrations: ['./migrations/**'],
  ssl: env === 'production',
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
