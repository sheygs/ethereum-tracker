import { Server } from 'socket.io';
import { config } from '../config';
import { Server as HttpServer } from 'http';

const { clientOrigin } = config?.app;

const createSocketIOServer = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: clientOrigin,
      methods: ['GET', 'POST'],
      allowedHeaders: ['authorization'],
      credentials: true,
    },
  });

  return io;
};

export { createSocketIOServer };
