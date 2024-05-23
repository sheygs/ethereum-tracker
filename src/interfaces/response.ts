import { User } from '../entities';
enum Status {
  SUCCESS = 'success',
  FAILURE = 'failure',
}

export enum RequestPath {
  BODY = 'body',
  QUERY = 'query',
  PARAMS = 'params',
  HEADERS = 'headers',
}

type AppResponse = {
  name: string;
  version: string;
  ver: string;
  description: string;
  authors: string;
  host: string;
  base_url?: string;
  port: number;
  environment: string;
};

interface SuccessResponse<T> {
  code: number;
  status: Status;
  message: string;
  data: T | {};
}

interface FailureResponse {
  code: number;
  status: Status;
  error: {
    name: string;
    message: string;
    stack?: string;
  };
}

type NotFoundError = {
  code: number;
  status: Status;
  message: string;
  path: string;
};

interface NotFoundResponse {
  error: NotFoundError;
}

type IUserResponse = {
  user: User;
  token?: string;
};

export {
  Status,
  AppResponse,
  SuccessResponse,
  FailureResponse,
  NotFoundResponse,
  IUserResponse,
};
