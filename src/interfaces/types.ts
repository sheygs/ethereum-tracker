enum Env {
  PRODUCTION = 'production',
  TEST = 'test',
  DEVELOPMENT = 'development',
}

enum Role {
  USER = 'user',
  ADMIN = 'admin',
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
  };
  database: {
    user: string;
    password: string;
    port: string | number;
    host: string;
    name: string;
  };
};

export { Env, Config, Role };
