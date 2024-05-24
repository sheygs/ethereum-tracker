import 'reflect-metadata';
import { hostname } from 'os';
import express, { Express } from 'express';
import { createServer } from 'http';
import { Socket } from 'socket.io';

import { config } from './config';
import { middlewares } from './app';
import { exitLog, createSocketIOServer } from './helpers';
import { connectToDataStore } from './database';
import { verifySocketAuth } from './middlewares';

const {
  app: { env, port },
} = config;

connectToDataStore();

const app: Express = express();

middlewares(app);

const httpServer = createServer(app);

const io = createSocketIOServer(httpServer);

io.use(verifySocketAuth).on('connection', (socket: Socket) => {
  socket.emit('message', `${(socket as any).user}!`);

  socket.on('disconnect', () => {
    io.emit('message', `${socket.id} disconnected`);
  });

  socket.on('error', (error) => {
    io.emit('error', `socket error:  ${error}`);
  });
});

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
