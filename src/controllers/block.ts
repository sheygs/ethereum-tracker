import { OK } from 'http-status';
import { NextFunction as NextFunc, Request, Response } from 'express';
import { paginate, successResponse } from '../utils';
import { PaginatedTransactions } from '../types';
import { blockChainService } from '../services';

class BlockChainController {
  static async getBlockNumber(_: Request, res: Response, next: NextFunc) {
    try {
      const { result } = await blockChainService.getBlockNumber();

      successResponse<{ result: string | null }>(
        res,
        OK,
        'blockNumber retrieved ✅',
        {
          result,
        },
      );
    } catch (error) {
      return next(error);
    }
  }

  static async getBlockTransactions(
    request: Request,
    res: Response,
    next: NextFunc,
  ) {
    const {
      params: { blockNum },
      query: { page, limit },
    } = request;

    const _page = page ? Number(page) : undefined;
    const _limit = limit ? Number(limit) : undefined;

    try {
      const response = await blockChainService.getTransactions(blockNum);

      const paginated = paginate(response, _page, _limit);

      successResponse<PaginatedTransactions>(
        res,
        OK,
        'transactions retrieved ✅',
        paginated,
      );
    } catch (error) {
      return next(error);
    }
  }
}

export { BlockChainController };
