import cors from 'cors';
import { join } from 'path';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import express, { Application } from 'express';
import { config } from './config';
import indexRoute from './routes';
import { defaultErrorHandler } from './middlewares';

export const middlewares = (app: Application): express.Application => {
  app.use(express.static(join(__dirname, '../public')));

  app.enable('trust proxy');
  app.use(compression());
  app.use(cors());
  app.use(helmet());

  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(
    express.urlencoded({
      extended: true,
      limit: '100mb',
    }),
  );

  if (config.app.env !== 'test') {
    app.use(morgan('dev'));
  }

  app.use(indexRoute);
  defaultErrorHandler(app);

  return app;
};
