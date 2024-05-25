import axios from 'axios';
import { ObjectProps } from '../../types';
import { config } from '../../config';
import { logger } from './logger';
import { BaseException } from '../exceptions';

// implement redis here
class Axios {
  private API_BASE_URL: string;

  constructor() {
    this.API_BASE_URL = config.app.RPCBaseUrl;
  }

  // will pass the key as arg
  public async post<T>(params: ObjectProps): Promise<T> {
    try {
      const { data } = await axios.post(`${this.API_BASE_URL}`, {
        ...params,
      });

      return data;
    } catch (error: any) {
      logger.error(
        `Error occured at endpoint call: ${this.API_BASE_URL} - ${JSON.stringify(error)}`,
      );
      throw new BaseException(
        error.response?.statusText,
        error.response?.status,
      );
    }
  }
}

export const axiosInstance = new Axios();
