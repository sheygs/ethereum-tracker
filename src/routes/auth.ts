import { Router } from 'express';
import { AuthController } from '../controllers';
import { loginSchema, signUpSchema, validateRequest } from '../utils';
import { RequestPath } from '../types';
import { verifyAuthToken } from '../middlewares';

const authRouter: Router = Router();

authRouter
  .route('/signup')
  .post(
    validateRequest(signUpSchema, RequestPath.BODY),
    AuthController.register,
  );

authRouter.post(
  '/login',
  validateRequest(loginSchema, RequestPath.BODY),
  AuthController.login,
);

authRouter.get('/me', verifyAuthToken, AuthController.currentUser);

authRouter.get('/token', AuthController.getAuthToken);

export default authRouter;
