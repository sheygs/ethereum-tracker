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
    base_url: string | undefined;
    port: string | number;
    env: string;
    jwt_secret: string;
    jwt_expires_in: string;
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
