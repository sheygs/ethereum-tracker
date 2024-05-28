import { Server } from 'socket.io';

import { Server as HttpServer } from 'http';
// import { config } from '../../config';

const createSocketIOServer = (server: HttpServer): Server => {
  const io = new Server(server, {
    cors: {
      // origin: config.app.clientOrigin,
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['authorization'],
      credentials: true,
    },
  });

  return io;
};

export { createSocketIOServer };
