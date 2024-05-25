import { Router } from 'express';
import { RequestPath } from '../types';
import { BlockChainController } from '../controllers';
import { blockChainNoSchema, validateRequest } from '../utils';

const blockRouter: Router = Router();

blockRouter.get('/', BlockChainController.getBlockNumber);

blockRouter.get(
  '/:blockNo',
  validateRequest(blockChainNoSchema, RequestPath.PARAMS),
  BlockChainController.getBlockTransactions,
);

export default blockRouter;
