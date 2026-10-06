import express from 'express';
import request from 'supertest';
import authRouter from '../../src/routes/auth';

jest.mock('../../src/controllers', () => ({
  AuthController: {
    register: jest.fn(),
    signIn: jest.fn(),
    currentUser: jest.fn(),
  },
}));
jest.mock('../../src/middlewares', () => ({ verifyAuthToken: jest.fn() }));
jest.mock('../../src/utils', () => ({
  validateRequest: () => (_req: unknown, _res: unknown, next: () => void) =>
    next(),
}));

it('does not expose a configured JWT through the former public token endpoint', async () => {
  process.env.JWT_TOKEN = 'private-token';
  const app = express();
  app.use('/api/v1/auth', authRouter);
  const response = await request(app).get('/api/v1/auth/token');
  expect(response.status).toBe(404);
  expect(response.text).not.toContain('private-token');
  delete process.env.JWT_TOKEN;
});
