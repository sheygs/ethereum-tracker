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
    allowedHeaders: ['Authorization'],
    credentials: true,
  },
});

type NextFunction = (error?: any) => void;

// middleware for JWT authentication
io.use(async (socket: Socket, next: NextFunction) => {
  try {
    const token: string = socket.handshake.auth.token ?? '';

    if (!token) {
      return next(new Error('no token provided'));
    }
    const decoded = jwt.verify(token, config.app.jwtSecret) as {
      id: string;
      role: string;
      email: string;
      iat: number;
      exp: number;
    };

    // console.log({ decoded });

    if (!decoded) {
      return next(new Error('invalid token'));
    }

    const userRepo: Repository<User> = dataSource.getRepository(User);

    const user = await new UniversalRepository<User>(userRepo).findOne({
      where: { id: decoded.id },
    });

    // console.log({ user });

    if (!user) {
      return next(new Error('Unauthorized user'));
    }

    (socket as any).user = user.id;

    next();
  } catch (error) {
    next(new Error('Authentication error'));
  }
});

io.on('connection', (socket: Socket) => {
  console.log(`user_id: ${(socket as any).user} connected`);

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });

  socket.on('error', (error) => {
    console.error('socket error: ', error);
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
