import { DataSource } from 'typeorm';
import { config } from '../config';
import { DataSourceOptions } from 'typeorm';

const {
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
  logging: config.app.env === 'development',
  synchronize: process.env.NODE_ENV !== 'production',
  migrations: ['migrations/**'],
  ssl: process.env.NODE_ENV === 'production',
};

const dataSource: DataSource = new DataSource(dataSourceOptions);

export { dataSource };
