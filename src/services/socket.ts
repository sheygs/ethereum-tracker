import { Server, Socket } from 'socket.io';
import { blockChainService as blockChain } from './block';
import { ITransaction } from '../types';

type IData = {
  event: string;
  address: string;
};

const initSocketEvents = (io: Server) => {
  return (socket: Socket): void => {
    socket.emit('message', `${(socket as any).user}`);

    socket.on('error', (error: Error) => {
      io.emit('error', error);
    });

    socket.on('subscribe', async (data: IData): Promise<void> => {
      const { event, address } = data;

      const interval: NodeJS.Timeout = setInterval(async () => {
        try {
          const { result } = await blockChain.getLatestBlockNumber();

          const response: ITransaction[] =
            await blockChain.getBlockTransactions(result);

          const transactions = blockChain.filterCondition(
            response,
            address,
            event,
          );

          socket.emit('transactions', transactions);
          // callback();
        } catch (error) {
          console.error(`Error fetching transactions: ${error}`);
          // callback(error);
        }
      }, 6 * 1000);

      socket.on('disconnect', () => {
        clearInterval(interval);
      });
    });
  };
};

export { initSocketEvents };
