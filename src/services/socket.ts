import { Server, Socket } from 'socket.io';
import { blockChainService as blockChain } from './block';
import { EventPayload, FilterCriteria } from '../types';
import { paginate } from '../utils';

const initSocketEvents = (io: Server) => {
  return (socket: Socket): void => {
    socket.emit('message', `${(socket as any).username}`);

    socket.on('error', (error: Error) => {
      io.emit('error', error);
    });

    socket.on(
      'subscribe',
      // N/B: Add the `callback` to Test on Postman
      async (event: EventPayload /*callback*/): Promise<void> => {
        const interval = setInterval(
          // Test on Postman
          // handleSocketEvents(socket, event, callback),
          handleSocketEvents(socket, event),
          10 * 1000,
        );

        socket.on('disconnect', () => {
          clearInterval(interval);
        });
      },
    );
  };
};

// UI/Client Test
const handleSocketEvents = (socket: Socket, event: EventPayload) => {
  return async () => {
    const { address, event_type, page, limit } = event;

    try {
      const { result: blockNo } = await blockChain.getBlockNumber();

      const transactions = await blockChain.getTransactions(blockNo);

      const filters: FilterCriteria = { transactions, address, event_type };

      const filtered = blockChain.filterByCriteria(filters);

      const paginated = paginate(filtered, page, limit);

      socket.emit('transactions', paginated);
    } catch (error) {
      console.error(`error fetching transactions: ${error}`);
      socket.emit('error', `transactions fetch failed: ${error}`);
    }
  };
};

// Test on Postman
// const _handleSocketEvents = (_: Socket, event: EventPayload, callback: any) => {
//   return async () => {
//     const { address, event_type, page, limit } = event;

//     try {
//       const { result: blockNo } = await blockChain.getBlockNumber();

//       const transactions = await blockChain.getTransactions(blockNo);

//       const filters: FilterCriteria = {
//         transactions,
//         address,
//         event_type,
//       };

//       const filtered = blockChain.filterByCondition(filters);

//       const paginated = paginate(filtered, page, limit);

//       callback({
//         paginated,
//       });
//     } catch (error) {
//       console.error(`Error fetching transactions: ${error}`);
//       callback({ error });
//     }
//   };
// };

export { initSocketEvents };
