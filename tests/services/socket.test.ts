import { initSocketEvents } from '../../src/services/socket';
import { blockChainService } from '../../src/services/block';
import { Socket } from 'socket.io';

jest.mock('../../src/services/block', () => ({
  blockChainService: {
    getBlockNumber: jest.fn(),
    getTransactions: jest.fn(),
    filterByCriteria: jest.fn(({ transactions }) => transactions),
  },
}));
jest.mock('../../src/utils', () => ({
  paginate: jest.requireActual('../../src/utils/helpers/paginate').paginate,
}));

const client = () => {
  const handlers: Record<string, (input?: unknown) => void> = {};
  const socket = {
    username: 'test',
    emit: jest.fn(),
    on: (event: string, handler: (input?: unknown) => void) => {
      handlers[event] = handler;
    },
  };
  return { socket, handlers };
};

beforeEach(() => {
  jest.useFakeTimers();
  jest.clearAllMocks();
});
afterEach(() => {
  jest.clearAllTimers();
  jest.useRealTimers();
});

it('shares polling, isolates pages, deduplicates subscriptions and supports unsubscribe', async () => {
  const connect = initSocketEvents();
  const a = client();
  const b = client();
  connect(a.socket as unknown as Socket);
  connect(b.socket as unknown as Socket);
  const event = { event_type: 'all', page: 1, limit: 1 };
  a.handlers.subscribe(event);
  a.handlers.subscribe(event);
  b.handlers.subscribe({ ...event, page: 2 });
  (blockChainService.getBlockNumber as jest.Mock).mockResolvedValue({
    result: '0x10',
  });
  (blockChainService.getTransactions as jest.Mock).mockResolvedValue([
    { hash: 'a' },
    { hash: 'b' },
  ]);
  await jest.advanceTimersByTimeAsync(10_000);
  expect(blockChainService.getTransactions).toHaveBeenCalledTimes(1);
  expect(a.socket.emit).toHaveBeenCalledWith(
    'transactions',
    expect.objectContaining({ results: [{ hash: 'a' }] }),
  );
  expect(b.socket.emit).toHaveBeenCalledWith(
    'transactions',
    expect.objectContaining({ results: [{ hash: 'b' }] }),
  );
  a.handlers.unsubscribe(event);
  b.handlers.unsubscribe(event);
  await jest.advanceTimersByTimeAsync(20_000);
  expect(blockChainService.getBlockNumber).toHaveBeenCalledTimes(1);
});

it('does not repeat a head and retries a failed intermediate block before catching up', async () => {
  const connect = initSocketEvents();
  const a = client();
  connect(a.socket as unknown as Socket);
  a.handlers.subscribe({ event_type: 'all' });
  const getHead = blockChainService.getBlockNumber as jest.Mock;
  const getBlock = blockChainService.getTransactions as jest.Mock;
  getHead.mockResolvedValue({ result: '0x10' });
  getBlock.mockResolvedValue([]);
  await jest.advanceTimersByTimeAsync(20_000);
  expect(getBlock).toHaveBeenCalledTimes(1);
  getHead.mockResolvedValue({ result: '0x13' });
  getBlock.mockRejectedValueOnce(new Error('Unavailable'));
  await jest.advanceTimersByTimeAsync(10_000);
  await jest.advanceTimersByTimeAsync(10_000);
  expect(getBlock.mock.calls.map(([block]) => block)).toEqual([
    '0x10',
    '0x11',
    '0x11',
    '0x12',
    '0x13',
  ]);
  a.handlers.disconnect();
});
