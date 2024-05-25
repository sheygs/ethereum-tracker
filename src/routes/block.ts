import { Router } from 'express';
import { RequestPath } from '../types';
import { BlockChainController } from '../controllers';
import {
  blockNumSchema,
  blockTransactionsSchema,
  validateRequest,
} from '../utils';

const blockRouter: Router = Router();

blockRouter.get('/', BlockChainController.getBlockNumber);

blockRouter.get(
  '/:blockNo',
  validateRequest(blockNumSchema, RequestPath.PARAMS),
  validateRequest(blockTransactionsSchema, RequestPath.QUERY),
  BlockChainController.getBlockTransactions,
);

export default blockRouter;
