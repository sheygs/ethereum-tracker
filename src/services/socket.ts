import { Server, Socket } from 'socket.io';
import { paginate } from '../utils';
import { blockChainService as blockChain } from './block';
import { EventPayload, FilterCriteria, PaginatedTransactions } from '../types';

// map to store socket to room mappings
const socketRoomMap: Map<Socket, string[]> = new Map();

// Callback types
type ErrorCallback = (error: Error) => void;
type SuccessCallback = (data: any) => void;

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

        updateRoom(socketRoomMap, room, socket);

        const interval = setInterval(
          handleSocketEvents(
            event,
            handleSuccess(io, room),
            handleError(io, room),
          ),
          10 * 1000,
        );

        socket.on('disconnect', () => {
          clearInterval(interval);

          socket.leave(room);

          removeRoomFromMap(socketRoomMap, room, socket);
        });
      },
    );

    // custom room info event
    socket.on('getRooms', () => {
      if (socketRoomMap.has(socket)) {
        const rooms = socketRoomMap.get(socket) || [];
        socket.emit('roomsInfo', rooms);
      }
    });
  };
};

const handleSocketEvents = (
  event: EventPayload,
  successCallback: SuccessCallback,
  errorCallback: ErrorCallback,
) => {
  return async () => {
    const { address, event_type, page, limit } = event;

    try {
      const { result: blockNum } = await blockChain.getBlockNumber();

      const transactions = await blockChain.getTransactions(blockNum);

      const filters: FilterCriteria = { transactions, address, event_type };

      const filtered = blockChain.filterByCriteria(filters);

      const paginated = paginate(filtered, page, limit);

      successCallback(paginated);
    } catch (error) {
      errorCallback(error as Error);
    }
  };
};

// success callback function
const handleSuccess = (io: Server, room: string): SuccessCallback => {
  return (data: PaginatedTransactions) =>
    io.to(room).emit('transactions', data);
};

// error callback function
const handleError = (io: Server, room: string): ErrorCallback => {
  return (error: Error) =>
    io.to(room).emit('error', `${JSON.stringify(error)}`);
};

// update map
const updateRoom = (
  roomMap: Map<Socket, string[]>,
  room: string,
  socket: Socket,
): void => {
  if (roomMap.has(socket)) {
    const rooms = roomMap.get(socket) || [];

    rooms.push(room);

    roomMap.set(socket, rooms);
  } else {
    roomMap.set(socket, [room]);
  }
};

// remove room from map
const removeRoomFromMap = (
  roomMap: Map<Socket, string[]>,
  room: string,
  socket: Socket,
) => {
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
};

const getRoomName = ({ address, event_type }: EventPayload): string => {
  const hasAddress = address ? `_${address}` : '';
  return `room_${event_type}${hasAddress}`;
};

export { initSocketEvents };
