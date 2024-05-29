import { Server } from 'socket.io';

import { Server as HttpServer } from 'http';

const createSocketIOServer = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['authorization'],
      credentials: true,
    },
  });

  return io;
};

export { createSocketIOServer };
