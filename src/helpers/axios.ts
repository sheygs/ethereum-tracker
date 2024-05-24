import axios from 'axios';
import { ObjectProps } from '../interfaces';
import { config } from '../config';
import { logger } from './logger';
import { BaseException } from './error';

class Axios {
  private API_BASE_URL: string;

  constructor() {
    this.API_BASE_URL = config.app.RPCBaseUrl;
  }

  public async post<T>(params: ObjectProps): Promise<T> {
    try {
      const { data } = await axios.post(`${this.API_BASE_URL}`, {
        ...params,
      });

      return data;
    } catch (error: any) {
      logger.error(`Error occured while calling RPC API - ${JSON.stringify(error)}`);
      throw new BaseException(error.response?.statusText, error.response?.status);
    }
  }
}

export const axiosInstance = new Axios();
