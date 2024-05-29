import jwt from 'jsonwebtoken';
import { Socket } from 'socket.io';
import { config } from '../config';
import { DecodedToken } from '../types';

type NextFunction = (error?: any) => void;

// socket JWT middleware
const verifySocketAuth = async (socket: Socket, next: NextFunction) => {
  const handshake = socket.handshake;

  const authHeader =
    handshake.auth?.token || handshake.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new Error('Authentication - Invalid headers'));
  }

  const token: string = authHeader.split(' ')[1];

  try {
    if (!token) {
      return next(new Error('No Token supplied'));
    }

    const decoded = jwt.verify(token, config.app.jwtSecret) as DecodedToken;

    if (!decoded) {
      return next(new Error('Invalid auth token'));
    }

    (socket as any).user_id = decoded.id;
    (socket as any).user_email = decoded.email;
    (socket as any).username = decoded.username;

    next();
  } catch (error) {
    next(new Error('Invalid auth token'));
  }
};

export { verifySocketAuth };
