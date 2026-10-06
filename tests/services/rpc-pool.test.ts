import { RPCPoolManager } from '../../src/services/rpc-pool';
import { axiosInstance } from '../../src/utils';

jest.mock('../../src/utils', () => ({
  axiosInstance: { post: jest.fn() },
  UnprocessableEntityException: class extends Error {},
}));

it('fails over when an HTTP 200 response contains a JSON-RPC error', async () => {
  const post = axiosInstance.post as jest.Mock;
  post
    .mockResolvedValueOnce({ status: 200, data: { result: '0x1' } })
    .mockResolvedValueOnce({ status: 200, data: { error: { code: -32000 } } })
    .mockResolvedValueOnce({ status: 200, data: { result: '0x2' } })
    .mockResolvedValueOnce({ status: 200, data: { result: '0x2' } });
  const pool = new RPCPoolManager(['first', 'second']);
  await expect(pool.sendRequest('eth_blockNumber', [])).resolves.toEqual({
    result: '0x2',
  });
  expect(post.mock.calls.map(([endpoint]) => endpoint)).toEqual([
    'first',
    'first',
    'second',
    'second',
  ]);
});
