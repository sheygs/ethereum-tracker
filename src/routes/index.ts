import { Router } from 'express';
import { baseRoute } from './base';
import { notFoundResponse } from '../utils';
import authRouter from './auth';
import blockRouter from './block';

const router: Router = Router();

router.get('/', baseRoute);
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/block-chain', blockRouter);
router.all('*', notFoundResponse);

export default router;
