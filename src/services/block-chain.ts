import { axiosInstance } from '../helpers';
import { BlockNumberResponse, BlockResponse, Transaction } from '../interfaces';

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
        params: [`${blockNumber}`, true],
        id: 1,
      });

      if (!response) {
        return;
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  public async getBlockTransactions(blockNo: string): Promise<Transaction[]> {
    try {
      const response = await this.getLatestBlock(blockNo);

      if (!response?.result.transactions?.length) {
        return [];
      }

      return response?.result.transactions;
    } catch (error) {
      throw error;
    }
  }

  public async filterTransactions() {}
}

export { BlockChainService };
