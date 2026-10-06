import { Response as Res, Request as Req } from 'express';
import httpStatus from 'http-status';
const { OK } = httpStatus;
import { config } from '../config';
import { successResponse } from '../utils';
import { AppResponse } from '../types';

const baseRoute = (_: Req, res: Res): void => {
  const transform = Object.entries(config.app).slice(0, 5);

  const data = Object.fromEntries(transform) as AppResponse;

  successResponse<AppResponse>(res, OK, 'okay', data);
};

export { baseRoute };
