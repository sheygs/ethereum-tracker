type BlockNumberResponse = {
  jsonrpc: string;
  id: number;
  result: string | null;
};

interface BlockResponse {
  jsonrpc: string;
  id: number;
  result: Result;
}

interface Result {
  baseFeePerGas: string;
  blobGasUsed: string;
  difficulty: string;
  excessBlobGas: string;
  extraData: string;
  gasLimit: string;
  gasUsed: string;
  hash: string;
  logsBloom: string;
  miner: string;
  mixHash: string;
  nonce: string;
  number: string;
  parentBeaconBlockRoot: string;
  parentHash: string;
  receiptsRoot: string;
  sha3Uncles: string;
  size: string;
  stateRoot: string;
  timestamp: string;
  totalDifficulty: string;
  transactions: Transaction[];
  transactionsRoot: string;
  uncles: any[];
  withdrawals: Withdrawal[];
  withdrawalsRoot: string;
}

type PayloadRequest = {
  blockNo: string;
  page?: number;
  limit?: number;
};

type BlockRequest = {
  jsonrpc: string;
  method: string;
  params: [string, boolean] | [];
  id: number;
};

interface Transaction {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  maxFeePerGas?: string;
  maxPriorityFeePerGas?: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  type: string;
  accessList?: AccessList[];
  chainId: string;
  v: string;
  r: string;
  s: string;
  yParity?: string;
  maxFeePerBlobGas?: string;
  blobVersionedHashes?: string[];
}

interface AccessList {
  address: string;
  storageKeys: string[];
}

interface Withdrawal {
  index: string;
  validatorIndex: string;
  address: string;
  amount: string;
}

interface ITransaction {
  /**
   * sender address
   */
  from: string;

  /**
   *  receiver address
   */
  to: string;

  /***
   *  block number
   */
  blockNumber: string;

  /**
   *  block hash
   */
  blockHash: string;

  /**
   * transaction hash
   */
  hash: string;

  /**
   * gas price (in hexadecimal)
   */
  gasPrice: string | number;

  /**
   *  value (in hexadecimal)
   */
  value: string | number;
}

type PaginatedTransactions = {
  totalCounts: number;
  itemsPerPage: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  currentPage: number;
  results: ITransaction[];
};

enum EventType {
  ALL = 'all',
  SENDER = 'sender',
  RECEIVER = 'receiver',
  SENDER_OR_RECEIVER = 'sender_or_receiver',
  VAL_0_100 = '0-100',
  VAL_100_500 = '100-500',
  VAL_500_2000 = '500-2000',
  VAL_2000_5000 = '2000-5000',
  VAL_5000 = '>5000',
}

type EventPayload = {
  event_type: string;
  address: string;
  page?: number;
  limit?: number;
};

type FilterCriteria = {
  transactions: ITransaction[];
  address?: string;
  event_type: string;
};

export {
  BlockNumberResponse,
  BlockResponse,
  Transaction,
  ITransaction,
  EventType,
  EventPayload,
  PaginatedTransactions,
  PayloadRequest,
  BlockRequest,
  FilterCriteria,
};
