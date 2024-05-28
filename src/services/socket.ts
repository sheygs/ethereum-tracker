import { Server, Socket } from 'socket.io';
import { blockChainService as blockChain } from './block';
import { EventPayload, FilterCriteria, ITransaction } from '../types';
import { paginate } from '../utils';

// Map to store socket to room mappings
const socketRoomMap: Map<Socket, string[]> = new Map();

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
        const room = getRoomName(event);
        socket.join(room);

        // Update socketRoomMap
        if (socketRoomMap.has(socket)) {
          const rooms = socketRoomMap.get(socket) || [];
          rooms.push(room);
          socketRoomMap.set(socket, rooms);
        } else {
          socketRoomMap.set(socket, [room]);
        }

        const interval = setInterval(
          // Test on Postman
          // handleSocketEvents(socket, event, callback),
          handleSocketEvents(io, event, room),
          10 * 1000,
        );

        socket.on('disconnect', () => {
          clearInterval(interval);
          socket.leave(room);

          // Remove room from socketRoomMap
          if (socketRoomMap.has(socket)) {
            const rooms = socketRoomMap.get(socket) || [];
            const index = rooms.indexOf(room);
            if (index !== -1) {
              rooms.splice(index, 1);
              if (rooms.length === 0) {
                socketRoomMap.delete(socket);
              } else {
                socketRoomMap.set(socket, rooms);
              }
            }
          }
        });
      },
    );

    // custom event to get room information
    socket.on('getRooms', () => {
      if (socketRoomMap.has(socket)) {
        const rooms = socketRoomMap.get(socket) || [];
        socket.emit('roomsInfo', rooms);
      }
    });
  };
};

// UI/Client Test
const handleSocketEvents = (io: Server, event: EventPayload, room: string) => {
  return async () => {
    const { address, event_type, page, limit } = event;

    try {
      const { result: blockNum } = await blockChain.getBlockNumber();

      const transactions = await blockChain.getTransactions(blockNum);

      const filters: FilterCriteria = { transactions, address, event_type };

      const filtered: ITransaction[] = blockChain.filterByCriteria(filters);

      const paginated = paginate(filtered, page, limit);

      io.to(room).emit('transactions', paginated);
    } catch (error) {
      io.to(room).emit('error', `transactions fetch failed: ${error}`);
    }
  };
};

const getRoomName = (event: EventPayload): string => {
  return `room_${event.event_type}_${event.address}`;
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
