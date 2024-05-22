import { DataSource } from 'typeorm';
import { config } from '../config';
import { DataSourceOptions } from 'typeorm';

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
  entities: ['build/entities/*.js'],
  logging: env === 'development',
  synchronize: env !== 'production',
  migrations: ['migrations/**'],
  ssl: env === 'production',
};

export const dataSource: DataSource = new DataSource(dataSourceOptions);
