import { NextFunction as NextFunc, Request, Response } from 'express';
import httpStatus from 'http-status';
import { User } from '../database';
import { authService } from '../services';
import { successResponse } from '../utils';
import { IUserResponse } from '../types';

const { OK, CREATED } = httpStatus;
export class AuthController {
  static async register(req: Request, res: Response, next: NextFunc) {
    try {
      const { user, token } = await authService.signUp(req.body as User);

      successResponse<IUserResponse>(res, CREATED, 'User Registered ✅', {
        user,
        token,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async signIn(req: Request, res: Response, next: NextFunc) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.signIn(email, password);
      successResponse<IUserResponse>(res, OK, 'User logged In ✅', {
        user,
        token,
      });
    } catch (error) {
      return next(error);
    }
  }

  static async currentUser(req: Request, res: Response, next: NextFunc) {
    try {
      const user = await authService.currentUser(req.user_id);
      successResponse<User>(res, OK, 'current user ✅', user);
    } catch (error) {
      return next(error);
    }
  }
}
