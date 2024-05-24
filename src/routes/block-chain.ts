import { Router } from 'express';
import { BlockChainController } from '../controllers';
import { blockChainNoSchema, validateRequest } from '../helpers';
import { RequestPath } from '../interfaces';

const blockRouter: Router = Router();

blockRouter.get('/', BlockChainController.getBlockNumber);

blockRouter.get(
  '/:blockNo',
  validateRequest(blockChainNoSchema, RequestPath.PARAMS),
  BlockChainController.getBlockTransactions,
);

export default blockRouter;
