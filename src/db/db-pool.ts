import { dataSource } from './data-source';
import { logger } from '../helpers';

export const connectDataSource = async (): Promise<void> => {
  try {
    await dataSource.initialize();

    logger.info('Data source connection successful');
  } catch (error: unknown) {
    logger.error(`Data source connection failed:\n${JSON.stringify(error)}`);

    process.exit(1);
  }
};
