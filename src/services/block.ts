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
      const response: BlockNumberResponse =
        await axiosInstance.post<BlockNumberResponse>({
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
      const response: BlockResponse = await axiosInstance.post<BlockResponse>({
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
      const response: BlockResponse | undefined =
        await this.getLatestBlock(blockNo);

      const { result: { transactions = [] } = {} } = response || {};

      if (!transactions?.length) return transactions;

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

  public filterCondition(
    transactions: ITransaction[],
    address: string,
    event: string,
  ): ITransaction[] {
    try {
      return transactions?.filter((transaction: ITransaction) => {
        const USDValue: number = weiToUSD(Number(transaction?.value));
        const senderAddress: string = transaction?.from?.toLowerCase();
        const receiverAddress: string = transaction?.to?.toLowerCase();
        const subscribedAddress: string = address?.toLowerCase();

        switch (event) {
          case EventType.ALL:
            return true;
          case EventType.SENDER_OR_RECEIVER:
            return (
              senderAddress === subscribedAddress ||
              receiverAddress === subscribedAddress
            );
          case EventType.SENDER:
            return senderAddress === subscribedAddress;
          case EventType.RECEIVER:
            return receiverAddress === subscribedAddress;
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
