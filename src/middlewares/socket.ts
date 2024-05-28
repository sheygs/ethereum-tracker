import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { Socket } from 'socket.io';
import { config } from '../config';
import { DecodedToken } from '../types';
import { User, UniversalRepository, dataSource } from '../database';

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

    const userRepo: Repository<User> = dataSource.getRepository(User);

    const user = await new UniversalRepository<User>(userRepo).findOne({
      where: { email: decoded.email },
    });

    if (!user) {
      return next(new Error('Invalid Email/Password'));
    }

    (socket as any).user_id = user.id;
    (socket as any).user_email = user.email;
    (socket as any).username = user.username;

    next();
  } catch (error) {
    next(new Error('Invalid auth token'));
  }
};

export { verifySocketAuth };
