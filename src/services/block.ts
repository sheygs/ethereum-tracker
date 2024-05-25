import { axiosInstance, hexToWei, weiToUSD } from '../utils';
import {
  BlockNumberResponse,
  BlockResponse,
  EventType,
  ITransaction,
  Transaction,
} from '../types';

class BlockChainService {
  public async getLatestBlockNumber(): Promise<BlockNumberResponse> {
    try {
      const response = await axiosInstance.post<BlockNumberResponse>({
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      });

      return response;
    } catch (error) {
      throw error;
    }
  }

  private async getLatestBlock(
    blockNumber: string,
  ): Promise<BlockResponse | undefined> {
    try {
      const response = await axiosInstance.post<BlockResponse>({
        jsonrpc: '2.0',
        method: 'eth_getBlockByNumber',
        params: [blockNumber, true],
        id: 1,
      });

      if (!response) return;

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getBlockTransactions(blockNo: string): Promise<ITransaction[]> {
    try {
      const response = await this.getLatestBlock(blockNo);

      const { result: { transactions = [] } = {} } = response || {};

      if (!transactions?.length) {
        return transactions;
      }

      const transformed = this.transformer(transactions);

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

  public filterCondition(
    transactions: ITransaction[],
    address: string,
    event: string,
  ): ITransaction[] {
    try {
      return transactions?.filter((transaction: ITransaction) => {
        const usdValue: number = weiToUSD(Number(transaction?.value));

        switch (event) {
          case EventType.ALL:
            return true;
          case EventType.SENDER_OR_RECEIVER:
            return (
              transaction?.from?.toLowerCase() === address?.toLowerCase() ||
              transaction?.to?.toLowerCase() === address?.toLowerCase()
            );
          case EventType.SENDER:
            return transaction?.from?.toLowerCase() === address?.toLowerCase();
          case EventType.RECEIVER:
            return transaction?.to?.toLowerCase() === address?.toLowerCase();
          case EventType.VAL_0_100:
            return usdValue > 0 && usdValue < 100;
          case EventType.VAL_100_500:
            return usdValue > 100 && usdValue < 500;
          case EventType.VAL_500_2000:
            return usdValue > 500 && usdValue < 2000;
          case EventType.VAL_2000_5000:
            return usdValue > 2000 && usdValue < 5000;
          case EventType.VAL_5000:
            return usdValue > 5000;
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
