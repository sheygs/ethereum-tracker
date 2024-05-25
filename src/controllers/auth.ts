import { NextFunction as NextFunc, Request, Response } from 'express';
import { OK, CREATED } from 'http-status';
import { User } from '../database';
import { config } from '../config';
import { authService } from '../services';
import { successResponse } from '../utils';
import { IUserResponse } from '../types';

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
      const user = await authService.currentUser((req as any).user);
      successResponse<User>(res, OK, 'current user ✅', user);
    } catch (error) {
      return next(error);
    }
  }

  /**
   *
   * @param res
   * @param next
   * @returns authToken
   */
  static async getAuthToken(_: Request, res: Response, next: NextFunc) {
    try {
      return successResponse<{}>(res, OK, 'token spooled ✅', {
        token: config.app.jwtToken,
      });
    } catch (error) {
      return next(error);
    }
  }
}
