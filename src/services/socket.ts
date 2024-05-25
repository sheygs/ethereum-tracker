import { Server, Socket } from 'socket.io';
import { blockChainService as blockChain } from './block';

type EventPayload = {
  event_type: string;
  address: string;
};

const initSocketEvents = (io: Server) => {
  return (socket: Socket): void => {
    socket.emit('message', `${(socket as any).username}`);

    socket.on('error', (error: Error) => {
      io.emit('error', error);
    });

    socket.on('subscribe', async (data: EventPayload): Promise<void> => {
      const { event_type, address } = data;

      const interval: NodeJS.Timeout = setInterval(async () => {
        try {
          const { result: blockNo } = await blockChain.getBlockNumber();

          const { results: transactions } = await blockChain.getTransactions({
            blockNo,
          });

          const filtered = blockChain.filterCondition({
            transactions,
            address,
            event_type,
          });

          socket.emit('transactions', filtered);
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
