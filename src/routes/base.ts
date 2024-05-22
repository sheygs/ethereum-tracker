import { Response as Res, Request as Req } from 'express';
import { successResponse } from '../helpers';
import { AppResponse } from '../interfaces';
import { OK } from 'http-status';
import { config } from '../config';

const baseRoute = (_: Req, res: Res): void => {
  const transform = Object.entries(config.APP)
    .slice(0, 9) // remove sensitive data
    .map(([key, value]) => [key.toLowerCase(), value]);

  const data = Object.fromEntries(transform) as AppResponse;

  successResponse<AppResponse>(res, OK, 'okay', data);
};

export { baseRoute };
