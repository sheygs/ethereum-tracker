import { NextFunction as NextFunc, Request, Response } from 'express';
import { User } from '../entities';
import { authService } from '../services';
import { successResponse } from '../helpers';
import { OK, CREATED } from 'http-status';
import { IUserResponse } from '../interfaces';

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

  static async login(req: Request, res: Response, next: NextFunc) {
    try {
      const { email, password } = req.body;
      const { user, token } = await authService.login(email, password);
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
      const user = await authService.currentUser((req as any).user);
      successResponse<User>(res, OK, 'current user ✅', user);
    } catch (error) {
      return next(error);
    }
  }
}
