enum Env {
  PRODUCTION = 'production',
  TEST = 'test',
  DEVELOPMENT = 'development',
}

enum Role {
  USER = 'user',
  ADMIN = 'admin',
}

type DecodedToken = {
  id: string;
  role: string;
  email: string;
  iat: number;
  exp: number;
};

interface ObjectProps {
  [prop: string]: any;
}

type Config = {
  app: {
    name: string;
    version: string;
    description: string;
    author: string;
    baseUrl: string | undefined;
    port: string | number;
    env: string;
    jwtSecret: string;
    jwtExpiresIn: string;
    clientOrigin: string;
    RPCBaseUrl: string;
    jwtToken?: string;
  };
  database: {
    user: string;
    password: string;
    port: string | number;
    host: string;
    name: string;
  };
};

export { Env, Config, Role, DecodedToken, ObjectProps };
