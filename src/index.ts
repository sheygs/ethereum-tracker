import 'reflect-metadata';
import os from 'os';
import express, { Express } from 'express';
import { createServer } from 'http';
import { config } from './config';
import { middlewares } from './app';
import { exitLog } from './helpers';
import { connectDataSource } from './db';

const {
  APP: { ENV, PORT },
} = config;

const app: Express = express();

connectDataSource();
middlewares(app);

const httpServer = createServer(app);

process
  .on('SIGINT', () => exitLog(null, 'SIGINT'))
  .on('SIGQUIT', () => exitLog(null, 'SIGQUIT'))
  .on('SIGTERM', () => exitLog(null, 'SIGTERM'))
  .on('uncaughtException', (error) => exitLog(error, 'uncaughtException'))
  .on('beforeExit', () => exitLog(null, 'beforeExit'))
  .on('exit', () => exitLog(null, 'exit'));

httpServer.listen({ port: PORT }, (): void => {
  process.stdout.write(`⚙️ Env: ${ENV}\n`);
  process.stdout.write(`⏱ Started on: ${Date.now()}\n`);
  process.stdout.write(
    `🚀 ethereum-tracker-api server ready at http://${os.hostname()}:${PORT}\n`,
  );
});

export { httpServer };
