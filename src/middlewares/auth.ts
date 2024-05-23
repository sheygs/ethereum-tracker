import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User } from '../entities';
import { dataSource } from '../database';
import { Repository } from 'typeorm';
import { UniversalRepository } from '../repositories';
import {
  BadRequestException,
  bearerTokenSchema,
  UnauthorizedException,
} from '../helpers';

const verifyAuthToken = async (req: Req, _: Res, next: Next): Promise<void> => {
  const { authorization = '' } = req.headers;

  const { error } = bearerTokenSchema.validate({ authorization });

  if (error) {
    return next(new BadRequestException(error.message));
  }

  try {
    const [, token] = authorization!.split(' ');

    let decoded: any;

    try {
      decoded = jwt.verify(token, config.app.jwtSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    const userRepo: Repository<User> = dataSource.getRepository(User);

    const user = await new UniversalRepository<User>(userRepo).findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    (req as any).user = user.id;

    next();
  } catch (error) {
    next(error);
  }
};

export { verifyAuthToken };
