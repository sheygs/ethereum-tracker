import httpStatus from 'http-status';
const { OK } = httpStatus;
import { config } from '../config';
import retry from 'async-retry';
import { axiosInstance } from '../utils';
import { BlockNumberResponse, BlockRequest } from '../types';
import { UnprocessableEntityException } from '../utils';

const { rpcBaseUrls } = config.app;

class RPCPoolManager {
  readonly endpoints: string[];
  private currentIndex: number;
  private numEndpoints: number;

  constructor(endpoints: string | string[]) {
    const urls =
      typeof endpoints === 'string' ? JSON.parse(endpoints) : endpoints;
    this.endpoints = urls;
    this.numEndpoints = this.endpoints?.length || 0;
    this.currentIndex = 0;
  }

  async isRPCAvailable(endpoint: string): Promise<boolean> {
    try {
      const params: BlockRequest = {
        jsonrpc: '2.0',
        method: 'eth_blockNumber',
        params: [],
        id: 1,
      };

      const { status, data } = await axiosInstance.post<
        BlockNumberResponse & { error?: unknown }
      >(endpoint, params);

      return status === OK && !data.error && typeof data.result === 'string';
    } catch {
      return false;
    }
  }

  async getCurrentEndpoint(): Promise<string> {
    try {
      for (let i = 0; i < this.numEndpoints; i++) {
        const endpoint = this.endpoints[this.currentIndex];

        this.currentIndex = (this.currentIndex + 1) % this.numEndpoints;

        const isConnected: boolean = await this.isRPCAvailable(endpoint);

        if (isConnected) {
          return endpoint;
        }
      }

      throw new UnprocessableEntityException('RPC endpoints are down');
    } catch (error) {
      throw error;
    }
  }

  async sendRequest<T>(
    method: string,
    params: [string, boolean] | [],
  ): Promise<T> {
    return retry(
      async () => {
        const endpoint = await this.getCurrentEndpoint();

        try {
          const { data } = await axiosInstance.post<
            T & { error?: unknown; result?: unknown }
          >(endpoint, {
            jsonrpc: '2.0',
            method,
            params,
            id: 1,
          });

          if (data.error || data.result === undefined || data.result === null) {
            throw new Error('Invalid RPC response');
          }
          return data;
        } catch {
          throw new UnprocessableEntityException(
            `request failed for endpoint: ${endpoint}`,
          );
        }
      },
      { retries: this.numEndpoints },
    );
  }
}

export { RPCPoolManager };

export const rpcPoolManager = new RPCPoolManager(rpcBaseUrls);
