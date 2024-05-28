import { Server, Socket } from 'socket.io';
import { blockChainService as blockChain } from './block';
import { EventPayload, FilterCriteria, ITransaction } from '../types';
import { paginate } from '../utils';

// Map to store socket to room mappings
const roomMap: Map<Socket, string[]> = new Map();

const initSocketEvents = (io: Server) => {
  return (socket: Socket): void => {
    socket.emit('message', `${(socket as any).username}`);

    socket.on('error', (error: Error) => {
      io.emit('error', error);
    });

    socket.on(
      'subscribe',

      async (event: EventPayload): Promise<void> => {
        const room = getRoomName(event);
        socket.join(room);

        // Update socketRoomMap
        if (roomMap.has(socket)) {
          const rooms = roomMap.get(socket) || [];
          rooms.push(room);
          roomMap.set(socket, rooms);
        } else {
          roomMap.set(socket, [room]);
        }

        const interval = setInterval(
          handleSocketEvents(io, event, room),
          10 * 1000,
        );

        socket.on('disconnect', () => {
          clearInterval(interval);
          socket.leave(room);

          // Remove room from roomMap
          if (roomMap.has(socket)) {
            const rooms = roomMap.get(socket) || [];
            const index = rooms.indexOf(room);
            if (index !== -1) {
              rooms.splice(index, 1);
              if (rooms.length === 0) {
                roomMap.delete(socket);
              } else {
                roomMap.set(socket, rooms);
              }
            }
          }
        });
      },
    );

    // custom event to get room information
    socket.on('getRooms', () => {
      if (roomMap.has(socket)) {
        const rooms = roomMap.get(socket) || [];
        socket.emit('roomsInfo', rooms);
      }
    });
  };
};

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

const getRoomName = ({ address, event_type }: EventPayload): string => {
  const hasAddress = address ? `_${address}` : '';
  return `room_${event_type}${hasAddress}`;
};

export { initSocketEvents };
