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
  APP: {
    NAME: string;
    VERSION: string;
    VER: string;
    DESCRIPTION: string;
    AUTHOR: string;
    HOST: string | undefined;
    BASE_URL: string | undefined;
    PORT: string | number;
    ENV: string;
    JWT_SECRET: string;
    JWT_EXPIRES_IN: string;
  };
  DB: {
    USER: string;
    PASSWORD: string;
    PG_PORT: string | number;
    HOST: string;
    DATABASE: string;
  };
};

export { Env, Config, Role };
