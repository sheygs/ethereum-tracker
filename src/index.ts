import 'reflect-metadata';
import os from 'os';
import express, { Express } from 'express';
import { createServer } from 'http';
import { config } from './config';
import { middlewares } from './app';
import { exitLog } from './helpers';
import { connectToDataStore } from './db';

const {
  app: { env, port },
} = config;

const app: Express = express();

connectToDataStore();

middlewares(app);

const httpServer = createServer(app);

process
  .on('SIGINT', () => exitLog(null, 'SIGINT'))
  .on('SIGQUIT', () => exitLog(null, 'SIGQUIT'))
  .on('SIGTERM', () => exitLog(null, 'SIGTERM'))
  .on('uncaughtException', (error) => exitLog(error, 'uncaughtException'))
  .on('beforeExit', () => exitLog(null, 'beforeExit'))
  .on('exit', () => exitLog(null, 'exit'));

httpServer.listen({ port }, (): void => {
  process.stdout.write(`⚙️ Env: ${env}\n`);
  process.stdout.write(`⏱ Started on: ${Date.now()}\n`);
  process.stdout.write(
    `🚀 ethereum-tracker-api server ready at http://${os.hostname()}:${port}\n`,
  );
});

export { httpServer };
