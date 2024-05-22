import { dataSource } from './data-source';
import { logger } from '../helpers';

export const connectToDataStore = async (): Promise<void> => {
  try {
    await dataSource.initialize();

    logger.info('connected to data source ✅');
  } catch (error: unknown) {
    logger.error(`Failed to connect to data source: ${JSON.stringify(error)}`);

    process.exit(1);
  }
};
