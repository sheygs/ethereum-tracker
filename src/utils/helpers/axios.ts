import axios from 'axios';
import { ObjectProps } from '../../types';
import { config } from '../../config';
import { logger } from './logger';
import { BaseException } from '../exceptions';

// implement redis for fast reads
// pass the key as argument here
const { timeout } = config.app;

class Axios {
  public async post<T>(
    endpoint: string,
    params: ObjectProps,
  ): Promise<{ status: number; data: T }> {
    try {
      const timeOut: { timeout: number } = { timeout: Number(timeout) };

      const { status, data } = await axios.post(
        `${endpoint}`,
        { ...params },
        timeOut,
      );

      return { status, data };
    } catch (error: any) {
      logger.error(`Error occured:- ${JSON.stringify(error)}`);
      throw new BaseException(
        error.response?.statusText,
        error.response?.status,
      );
    }
  }
}

export const axiosInstance = new Axios();
