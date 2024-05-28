import {
  hexToWei,
  weiToUSD,
  ethToUSD,
  WEI_IN_ETHER,
  weiToETH,
  paginate,
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

describe('pagination function', () => {
  const mockTransactions = [
    {
      from: '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13',
      to: '0x6b75d8af000000e20b7a7ddf000ba900b4009a80',
      blockHash:
        '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
      hash: '0x16a0ba08e9cee3457432091cdba7d0257f1ff3dac305290f2a0b60217b2b27e3',
      blockNumber: '0x130a373',
      gasPrice: 10351374772,
      value: 158208623731,
    },
    {
      from: '0x0eedc34d0e0a6cef2d04027590f22ca25309167e',
      to: '0x6131b5fae19ea4f9d964eac0408e4408b66337b5',
      blockHash:
        '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
      hash: '0x93cb252deaf920b433250cabbaad92d3b987f107523f88389513f28b1c56e000',
      blockNumber: '0x130a373',
      gasPrice: 10398070159,
      value: 0,
    },
    {
      from: '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13',
      to: '0x6b75d8af000000e20b7a7ddf000ba900b4009a80',
      blockHash:
        '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
      hash: '0xefa375bd0db47077ff6c4318c78641af704b87e8b86d03a2216a07945f8e1563',
      blockNumber: '0x130a373',
      gasPrice: 3595654293961,
      value: 137989593715,
    },
    {
      from: '0xed237edb351c5da602bfa65304fcaa0ad59b9aca',
      to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
      blockHash:
        '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
      hash: '0xe671f62294b0fd770a5aebbfd8c97a30b2762b37e274ace3021e72a0d4493829',
      blockNumber: '0x130a373',
      gasPrice: 12851374772,
      value: 0,
    },
    {
      from: '0x3cbc1d88ba30bed64384acc961788bfa17190528',
      to: '0xf904f17129a86a3d4aa0917d691b39ec64e7312c',
      blockHash:
        '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
      hash: '0xb1267afa17a435800536aa83db5544374f7d73820d91c94f151e5653a9263318',
      blockNumber: '0x130a373',
      gasPrice: 12851374772,
      value: 83696062510618990,
    },
  ];

  it('should paginate correctly with default values', () => {
    const result = paginate(mockTransactions);
    expect(result.totalCounts).toBe(5);
    expect(result.itemsPerPage).toBe(10); // default limit
    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(false);
    expect(result.currentPage).toBe(1);
    expect(result.results).toEqual(mockTransactions);
  });

  it('should paginate correctly with custom page and limit', () => {
    const result = paginate(mockTransactions, 2, 2);
    expect(result.totalCounts).toBe(5);
    expect(result.itemsPerPage).toBe(2);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.hasNextPage).toBe(true);
    expect(result.currentPage).toBe(2);
    expect(result.results).toEqual([
      {
        from: '0xae2fc483527b8ef99eb5d9b44875f005ba1fae13',
        to: '0x6b75d8af000000e20b7a7ddf000ba900b4009a80',
        blockHash:
          '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
        hash: '0xefa375bd0db47077ff6c4318c78641af704b87e8b86d03a2216a07945f8e1563',
        blockNumber: '0x130a373',
        gasPrice: 3595654293961,
        value: 137989593715,
      },
      {
        from: '0xed237edb351c5da602bfa65304fcaa0ad59b9aca',
        to: '0x7a250d5630b4cf539739df2c5dacb4c659f2488d',
        blockHash:
          '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
        hash: '0xe671f62294b0fd770a5aebbfd8c97a30b2762b37e274ace3021e72a0d4493829',
        blockNumber: '0x130a373',
        gasPrice: 12851374772,
        value: 0,
      },
    ]);
  });

  it('should handle edge cases', () => {
    const result = paginate(mockTransactions, 3, 2);
    expect(result.totalCounts).toBe(5);
    expect(result.itemsPerPage).toBe(2);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.hasNextPage).toBe(false); // Only 5 items, so no next page
    expect(result.currentPage).toBe(3);
    expect(result.results).toEqual([
      {
        from: '0x3cbc1d88ba30bed64384acc961788bfa17190528',
        to: '0xf904f17129a86a3d4aa0917d691b39ec64e7312c',
        blockHash:
          '0x090911955261c01ffe88dc5deb06701bf25fce0a6357c350832ebdcc106542fa',
        hash: '0xb1267afa17a435800536aa83db5544374f7d73820d91c94f151e5653a9263318',
        blockNumber: '0x130a373',
        gasPrice: 12851374772,
        value: 83696062510618990,
      },
    ]);
  });

  it('should return an empty array if there are no transactions', () => {
    const result = paginate([]);
    expect(result.totalCounts).toBe(0);
    expect(result.itemsPerPage).toBe(10); // default limit
    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(false);
    expect(result.currentPage).toBe(1);
    expect(result.results).toEqual([]);
  });

  it('should handle page number exceeding total pages', () => {
    const result = paginate(mockTransactions, 10, 2);
    expect(result.totalCounts).toBe(5);
    expect(result.itemsPerPage).toBe(2);
    expect(result.hasPreviousPage).toBe(true);
    expect(result.hasNextPage).toBe(false);
    expect(result.currentPage).toBe(10);
    expect(result.results).toEqual([]);
  });

  it('should handle limit larger than total transactions', () => {
    const result = paginate(mockTransactions, 1, 10);
    expect(result.totalCounts).toBe(5);
    expect(result.itemsPerPage).toBe(10);
    expect(result.hasPreviousPage).toBe(false);
    expect(result.hasNextPage).toBe(false);
    expect(result.currentPage).toBe(1);
    expect(result.results).toEqual(mockTransactions);
  });
});
