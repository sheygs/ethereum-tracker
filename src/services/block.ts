import { rpcPoolManager } from './rpc-pool';
import {
  defaultBlockResponse,
  hexToWei,
  UnprocessableEntityException,
  weiToUSD,
} from '../utils';
import {
  BlockNumberResponse,
  BlockResponse,
  EventType,
  ITransaction,
  Transaction,
  FilterCriteria,
} from '../types';

class BlockChainService {
  public async getBlockNumber(): Promise<BlockNumberResponse> {
    try {
      const response: BlockNumberResponse =
        await rpcPoolManager.sendRequest<BlockNumberResponse>(
          'eth_blockNumber',
          [],
        );

      if (!response?.result) {
        throw new UnprocessableEntityException('failed to fetch block number');
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  private async getLatestBlock(blockNum: string): Promise<BlockResponse> {
    try {
      const response = await rpcPoolManager.sendRequest<BlockResponse>(
        'eth_getBlockByNumber',
        [blockNum, true],
      );

      if (!response?.result) {
        return defaultBlockResponse(response?.jsonrpc, response?.id);
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getTransactions(blockNum: string): Promise<ITransaction[]> {
    try {
      const response = await this.getLatestBlock(blockNum);

      const { result: { transactions = [] } = {} } = response ?? {};

      if (!transactions.length) {
        return transactions;
      }

      const transformed: ITransaction[] = this.transformer(transactions);

      return transformed;
    } catch (error) {
      throw error;
    }
  }

  private transformer(transactions: Transaction[]): ITransaction[] {
    try {
      return transactions?.map((transaction: Transaction) => {
        const { from, to, blockHash, hash, blockNumber, gasPrice, value } =
          transaction;

        return {
          from,
          to,
          blockHash,
          hash,
          blockNumber,
          gasPrice: hexToWei(gasPrice),
          value: hexToWei(value),
        };
      });
    } catch (error) {
      throw error;
    }
  }

  public filterByCriteria(filterCriteria: FilterCriteria): ITransaction[] {
    const { transactions, event_type, address } = filterCriteria;

    try {
      return transactions?.filter((transaction: ITransaction) => {
        const USDValue: number = weiToUSD(Number(transaction?.value));

        const senderAddress: string = transaction?.from?.toLowerCase();

        const receiverAddress: string = transaction?.to?.toLowerCase();

        const requestAddress: string | undefined = address?.toLowerCase();

        switch (event_type) {
          case EventType.ALL:
            return true;
          case EventType.SENDER_OR_RECEIVER:
            return (
              senderAddress === requestAddress ||
              receiverAddress === requestAddress
            );
          case EventType.SENDER:
            return senderAddress === requestAddress;
          case EventType.RECEIVER:
            return receiverAddress === requestAddress;
          case EventType.VAL_0_100:
            return USDValue >= 0 && USDValue <= 100;
          case EventType.VAL_100_500:
            return USDValue >= 100 && USDValue <= 500;
          case EventType.VAL_500_2000:
            return USDValue >= 500 && USDValue <= 2000;
          case EventType.VAL_2000_5000:
            return USDValue >= 2000 && USDValue <= 5000;
          case EventType.VAL_5000:
            return USDValue > 5000;
          default:
            return false;
        }
      });
    } catch (error) {
      throw error;
    }
  }
}

export const blockChainService: BlockChainService = new BlockChainService();
