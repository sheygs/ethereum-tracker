import 'reflect-metadata';
import { hostname } from 'os';
import express, { Express } from 'express';
import { createServer } from 'http';
import { config } from './config';
import { middlewares } from './app';
import { connectToDataStore } from './database';
import { verifySocketAuth } from './middlewares';
import { initSocketEvents } from './services';
import { exitLog, createSocketIOServer } from './utils';

const {
  app: { env, port },
} = config;

const app: Express = express();

connectToDataStore();

middlewares(app);

const httpServer = createServer(app);

const io = createSocketIOServer(httpServer);

io.use(verifySocketAuth).on('connection', initSocketEvents(io));

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
    `🚀 ethereum-tracker-api server ready at http://${hostname()}:${port}\n`,
  );
});

export { httpServer };
