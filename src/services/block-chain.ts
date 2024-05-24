import { axiosInstance } from '../helpers';
import { BlockNumberResponse, BlockResponse, Transaction } from '../interfaces';

class BlockChainService {
  public async getLatestBlockNumber(): Promise<BlockNumberResponse> {
    try {
      // response.result - blockNumber
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

  public async getBlockTransactions(blockNo: string): Promise<Transaction[]> {
    try {
      const response = await this.getLatestBlock(blockNo);

      const { result: { transactions = [] } = {} } = response || {};

      if (!transactions.length) {
        return transactions;
      }

      return transactions;
    } catch (error) {
      throw error;
    }
  }

  public async isFilterConditionsMet(_: Transaction[]): Promise<boolean> {
    try {
      return true;
    } catch (error) {
      throw error;
    }
  }
}

export const blockChainService: BlockChainService = new BlockChainService();
