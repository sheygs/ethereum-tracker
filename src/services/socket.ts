import { Socket } from 'socket.io';
import { paginate } from '../utils';
import { blockChainService as blockChain } from './block';
import { EventPayload, EventType } from '../types';

type Subscription = { event: EventPayload; nextBlock?: bigint };

const getRoomName = ({ address, event_type }: EventPayload): string =>
  `room_${event_type}${address ? `_${address.toLowerCase()}` : ''}`;

const validateEvent = (input: unknown): EventPayload => {
  if (!input || typeof input !== 'object')
    throw new Error('Invalid subscription');

  const event = input as EventPayload;

  if (!Object.values(EventType).includes(event.event_type as EventType)) {
    throw new Error('Invalid event type');
  }

  const requiresAddress = [
    EventType.SENDER,
    EventType.RECEIVER,
    EventType.SENDER_OR_RECEIVER,
  ].includes(event.event_type as EventType);

  if (
    (requiresAddress || event.address) &&
    (typeof event.address !== 'string' ||
      !/^0x[0-9a-fA-F]{40}$/.test(event.address))
  ) {
    throw new Error('Invalid Ethereum address');
  }

  for (const value of [event.page, event.limit]) {
    if (value !== undefined && (!Number.isSafeInteger(value) || value < 1)) {
      throw new Error('Page and limit must be positive integers');
    }
  }

  return {
    event_type: event.event_type,
    address: event.address?.toLowerCase(),
    page: event.page,
    limit: event.limit,
  };
};

const initSocketEvents = () => {
  const subscriptions = new Map<Socket, Map<string, Subscription>>();
  let timer: ReturnType<typeof setInterval> | undefined;
  let polling = false;

  const poll = async () => {
    if (polling || !subscriptions.size) return;
    polling = true;

    try {
      const { result } = await blockChain.getBlockNumber();
      const head = BigInt(result);
      let next = head + 1n;
      for (const rooms of subscriptions.values()) {
        for (const sub of rooms.values()) {
          sub.nextBlock ??= head;
          if (sub.nextBlock < next) next = sub.nextBlock;
        }
      }
      // Bound each pass while preserving the cursor for subsequent catch-up.
      for (let count = 0; next <= head && count < 100; next++, count++) {
        if (!subscriptions.size) break;
        const transactions = await blockChain.getTransactions(
          `0x${next.toString(16)}`,
        );
        for (const [socket, rooms] of subscriptions) {
          for (const sub of rooms.values()) {
            if (sub.nextBlock === undefined || sub.nextBlock > next) continue;
            const { address, event_type, page, limit } = sub.event;
            const filtered = blockChain.filterByCriteria({
              transactions,
              address,
              event_type,
            });
            socket.emit('transactions', paginate(filtered, page, limit));
            sub.nextBlock = next + 1n;
          }
        }
      }
    } catch (error) {
      for (const socket of subscriptions.keys()) {
        socket.emit('error', {
          message: error instanceof Error ? error.message : 'Streaming failed',
        });
      }
    } finally {
      polling = false;
    }
  };

  const stopWhenEmpty = () => {
    if (!subscriptions.size && timer) {
      clearInterval(timer);
      timer = undefined;
    }
  };

  return (socket: Socket): void => {
    socket.emit('message', socket.username);
    socket.on('subscribe', (input: unknown) => {
      try {
        const event = validateEvent(input);
        const room = getRoomName(event);
        const rooms =
          subscriptions.get(socket) ?? new Map<string, Subscription>();
        const existing = rooms.get(room);
        if (existing) existing.event = event;
        else rooms.set(room, { event });
        subscriptions.set(socket, rooms);
        if (!timer)
          timer = setInterval(() => {
            void poll();
          }, 10_000);
      } catch (error) {
        socket.emit('error', { message: (error as Error).message });
      }
    });
    socket.on('unsubscribe', (input: unknown) => {
      try {
        const event = validateEvent(input);
        const rooms = subscriptions.get(socket);
        rooms?.delete(getRoomName(event));
        if (!rooms?.size) subscriptions.delete(socket);
        stopWhenEmpty();
      } catch (error) {
        socket.emit('error', { message: (error as Error).message });
      }
    });
    socket.on('getRooms', () => {
      socket.emit('roomsInfo', [...(subscriptions.get(socket)?.keys() ?? [])]);
    });
    socket.on('disconnect', () => {
      subscriptions.delete(socket);
      stopWhenEmpty();
    });
  };
};

export { initSocketEvents };
