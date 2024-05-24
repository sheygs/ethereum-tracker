import 'reflect-metadata';
import { hostname } from 'os';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import express, { Express } from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { User } from './entities';
import { config } from './config';
import { middlewares } from './app';
import { exitLog } from './helpers';
import { UniversalRepository } from './repositories';
import { connectToDataStore, dataSource } from './database';
import { DecodedToken } from './interfaces';

const {
  app: { env, port },
} = config;

const app: Express = express();

connectToDataStore();

middlewares(app);

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: config.app.clientOrigin,
    methods: ['GET', 'POST'],
    allowedHeaders: ['authorization'],
    credentials: true,
  },
});

type NextFunction = (error?: any) => void;

// JWT middleware for socket authentication
io.use(async (socket: Socket, next: NextFunction) => {
  const authHeader =
    socket.handshake.auth.token || socket.handshake.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new Error('Authentication - Invalid headers'));
  }

  const token: string = authHeader.split(' ')[1];

  try {
    if (!token) {
      return next(new Error('Invalid Token supplied'));
    }

    const decoded = jwt.verify(token, config.app.jwtSecret) as DecodedToken;

    if (!decoded) {
      return next(new Error('invalid auth credentials'));
    }

    const userRepo: Repository<User> = dataSource.getRepository(User);

    const user = await new UniversalRepository<User>(userRepo).findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      return next(new Error('Invalid Email/Password'));
    }

    (socket as any).user = user.id;

    return next();
  } catch (error) {
    next(new Error('Invalid auth token'));
  }
});

io.on('connection', (socket: Socket) => {
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
