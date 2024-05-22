import { Request as Req, Response as Res, NextFunction as Next } from 'express';
import jwt from 'jsonwebtoken';
import { Container } from 'typedi';
import { config } from '../config';
import {
  BadRequestException,
  bearerTokenSchema,
  UnauthorizedException,
} from '../helpers';

import { UserService } from '../services';

const userService = Container.get(UserService);

const verifyAuthToken = async (req: Req, _: Res, next: Next): Promise<void> => {
  const { authorization } = req.headers;

  const { error } = bearerTokenSchema.validate(req.headers);

  if (error) {
    throw new BadRequestException(error.details[0].message);
  }

  try {
    const [, token] = authorization!.split('Bearer ');

    let decoded: any;

    if (!token) {
      throw new BadRequestException('No token provided');
    }

    try {
      decoded = jwt.verify(token, config.app.jwtSecret);
    } catch (error) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    const user = await userService.findOne({
      where: { id: decoded.id },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid authorization token');
    }

    req.user = user.id;

    next();
  } catch (error) {
    throw error;
  }
};

export { verifyAuthToken };
