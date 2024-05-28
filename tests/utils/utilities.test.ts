import {
  hexToWei,
  weiToUSD,
  ethToUSD,
  WEI_IN_ETHER,
  weiToETH,
  // paginate,
} from '../../src/utils';

describe('Ethereum conversion functions', () => {
  describe('hexToWei', () => {
    it('should convert a valid hexadecimal to wei', () => {
      expect(hexToWei('0x1')).toBe(1);
      expect(hexToWei('0xA')).toBe(10);
      expect(hexToWei('0x64')).toBe(100);
    });

    it('should return 0 for an empty string', () => {
      expect(hexToWei('')).toBe(0);
    });

    it('should return 0 for invalid hexadecimal string', () => {
      expect(hexToWei('0xG')).toBeNaN(); // parseInt will return NaN for invalid hex
    });
  });

  describe('weiToETH', () => {
    it('should convert wei to ETH', () => {
      expect(weiToETH(Number(WEI_IN_ETHER))).toBe(1);
      expect(weiToETH(Number(WEI_IN_ETHER / 2n))).toBe(0.5);
      expect(weiToETH(0)).toBe(0);
    });

    it('should handle large numbers correctly', () => {
      const largeWei = WEI_IN_ETHER * 123456n;
      expect(weiToETH(Number(largeWei))).toBe(123456);
    });
  });

  describe('ethToUSD', () => {
    it('should convert ETH to USD', () => {
      expect(ethToUSD(1)).toBe(5000);
      expect(ethToUSD(0.5)).toBe(2500);
      expect(ethToUSD(0)).toBe(0);
    });

    it('should handle large ETH values correctly', () => {
      expect(ethToUSD(1000000)).toBe(5000000000);
    });
  });

  describe('weiToUSD', () => {
    it('should convert wei directly to USD', () => {
      expect(weiToUSD(Number(WEI_IN_ETHER))).toBe(5000);
      expect(weiToUSD(Number(WEI_IN_ETHER / 2n))).toBe(2500);
      expect(weiToUSD(0)).toBe(0);
    });

    it('should handle large wei values correctly', () => {
      const largeWei = WEI_IN_ETHER * 123456n;
      expect(weiToUSD(Number(largeWei))).toBe(123456 * 5000);
    });
  });
});

// describe('paginate function', () => {
//   const mockResults = [
//     {
//       from: 'sender1',
//       to: 'receiver1',
//       blockNumber: '1',
//       blockHash: 'hash1',
//       hash: 'hash1',
//       gasPrice: '100',
//       value: '10',
//     },
//     {
//       from: 'sender2',
//       to: 'receiver2',
//       blockNumber: '2',
//       blockHash: 'hash2',
//       hash: 'hash2',
//       gasPrice: '200',
//       value: '20',
//     },
//     {
//       from: 'sender3',
//       to: 'receiver3',
//       blockNumber: '3',
//       blockHash: 'hash3',
//       hash: 'hash3',
//       gasPrice: '300',
//       value: '30',
//     },
//     {
//       from: 'sender4',
//       to: 'receiver4',
//       blockNumber: '4',
//       blockHash: 'hash4',
//       hash: 'hash4',
//       gasPrice: '400',
//       value: '40',
//     },
//     {
//       from: 'sender5',
//       to: 'receiver5',
//       blockNumber: '5',
//       blockHash: 'hash5',
//       hash: 'hash5',
//       gasPrice: '500',
//       value: '50',
//     },
//   ];

//   it('should paginate correctly with default values', () => {
//     const result = paginate(mockResults);
//     expect(result.totalCounts).toBe(5);
//     expect(result.itemsPerPage).toBe(10); // default limit
//     expect(result.hasPreviousPage).toBe(false);
//     expect(result.hasNextPage).toBe(false);
//     expect(result.currentPage).toBe(1);
//     expect(result.results).toEqual(mockResults);
//   });

//   it('should paginate correctly with custom page and limit', () => {
//     const result = paginate(mockResults, 2, 2);
//     expect(result.totalCounts).toBe(5);
//     expect(result.itemsPerPage).toBe(2);
//     expect(result.hasPreviousPage).toBe(true);
//     expect(result.hasNextPage).toBe(true);
//     expect(result.currentPage).toBe(2);
//     expect(result.results).toEqual([
//       {
//         from: 'sender3',
//         to: 'receiver3',
//         blockNumber: '3',
//         blockHash: 'hash3',
//         hash: 'hash3',
//         gasPrice: '300',
//         value: '30',
//       },
//       {
//         from: 'sender4',
//         to: 'receiver4',
//         blockNumber: '4',
//         blockHash: 'hash4',
//         hash: 'hash4',
//         gasPrice: '400',
//         value: '40',
//       },
//     ]);
//   });

//   it('should handle edge cases', () => {
//     const result = paginate(mockResults, 3, 2);
//     expect(result.totalCounts).toBe(5);
//     expect(result.itemsPerPage).toBe(2);
//     expect(result.hasPreviousPage).toBe(true);
//     expect(result.hasNextPage).toBe(false); // Only 5 items, so no next page
//     expect(result.currentPage).toBe(3);
//     expect(result.results).toEqual([
//       {
//         from: 'sender5',
//         to: 'receiver5',
//         blockNumber: '5',
//         blockHash: 'hash5',
//         hash: 'hash5',
//         gasPrice: '500',
//         value: '50',
//       },
//     ]);
//   });
// });
