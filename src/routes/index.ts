import { Router } from 'express';
import { baseRoute } from './base';
import { notFoundResponse } from '../helpers';
import authRouter from './auth';
import blockRouter from './block-chain';

const router: Router = Router();

router.get('/', baseRoute);
router.use('/api/v1/auth', authRouter);
router.use('/api/v1/block-chain', blockRouter);
router.all('*', notFoundResponse);

export default router;
