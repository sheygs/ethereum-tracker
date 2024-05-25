import { OK } from 'http-status';
import { NextFunction as NextFunc, Request, Response } from 'express';
import { successResponse } from '../utils';
import { PaginatedTransactions } from '../types';
import { blockChainService } from '../services';

class BlockChainController {
  static async getBlockNumber(_: Request, res: Response, next: NextFunc) {
    try {
      const { result } = await blockChainService.getBlockNumber();

      successResponse<{ result: string }>(res, OK, 'blockNumber retrieved ✅', {
        result,
      });
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
      params: { blockNo },
      query: { page, limit },
    } = request;

    const parsedPage = page ? Number(page) : undefined;
    const parsedLimit = limit ? Number(limit) : undefined;

    try {
      const response = await blockChainService.getTransactions({
        blockNo,
        page: parsedPage,
        limit: parsedLimit,
      });

      successResponse<PaginatedTransactions>(
        res,
        OK,
        'transactions retrieved ✅',
        response,
      );
    } catch (error) {
      return next(error);
    }
  }
}

export { BlockChainController };
