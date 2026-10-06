import express from 'express';
import request from 'supertest';
import { middlewares } from '../../src/app';

jest.mock('../../src/services', () => ({
  authService: { signIn: jest.fn(), signUp: jest.fn() },
  blockChainService: {
    getBlockNumber: jest.fn().mockResolvedValue({ result: '0x1' }),
    getTransactions: jest.fn().mockResolvedValue([]),
  },
}));

it('starts the Express 5 router and returns JSON for unknown paths', async () => {
  const app = middlewares(express());
  const response = await request(app).get('/missing/path');
  expect(response.status).toBe(404);
  expect(response.body.error.path).toContain('/missing/path');
});

it('accepts pagination strings through Express 5 request validation', async () => {
  const app = middlewares(express());
  const response = await request(app).get(
    '/api/v1/block-chain/0x1?page=2&limit=5',
  );
  expect(response.status).toBe(200);
  expect(response.body.data).toMatchObject({
    currentPage: 2,
    itemsPerPage: 5,
    results: [],
  });
});

it('returns a validation error for invalid pagination', async () => {
  const app = middlewares(express());
  const response = await request(app).get('/api/v1/block-chain/0x1?page=0');
  expect(response.status).toBe(422);
});
