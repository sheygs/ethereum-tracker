import { blockChainService } from '../../src/services/block';
import { rpcPoolManager } from '../../src/services/rpc-pool';
import { EventType, ITransaction } from '../../src/types';

jest.mock('../../src/services/rpc-pool', () => ({
  rpcPoolManager: { sendRequest: jest.fn() },
}));
jest.mock('../../src/utils', () => ({
  ...jest.requireActual('../../src/utils/helpers/block'),
  UnprocessableEntityException: class extends Error {},
}));

it('transforms wei without rounding and accepts contract creation transactions', async () => {
  (rpcPoolManager.sendRequest as jest.Mock).mockResolvedValue({
    result: {
      transactions: [
        {
          from: '0xsender',
          to: null,
          blockHash: 'block',
          hash: 'transaction',
          blockNumber: '0x1',
          gasPrice: '0x1',
          value: '0xde0b6b3a7640001',
        },
      ],
    },
  });
  const transactions = await blockChainService.getTransactions('0x1');
  expect(transactions[0]).toMatchObject({
    value: '1000000000000000001',
    gasPrice: '1',
    to: null,
  });
  expect(
    blockChainService.filterByCriteria({
      transactions,
      event_type: EventType.VAL_5000,
    }),
  ).toEqual(transactions);
});

it('compares range boundaries exactly, including a single wei above $100', () => {
  const transactions = ['20000000000000000', '20000000000000001'].map(
    (value) =>
      ({
        from: 'sender',
        to: 'receiver',
        value,
        gasPrice: '1',
        hash: value,
        blockHash: 'block',
        blockNumber: '0x1',
      }) satisfies ITransaction,
  );
  expect(
    blockChainService.filterByCriteria({
      transactions,
      event_type: EventType.VAL_0_100,
    }),
  ).toEqual([transactions[0]]);
});
