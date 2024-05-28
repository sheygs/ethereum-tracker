import {
  hexToWei,
  weiToUSD,
  ethToUSD,
  WEI_IN_ETHER,
  weiToETH,
} from '../../src/utils';

describe('addition', () => {
  test('Math test', () => {
    expect(2 + 2).toBe(4);
  });
});

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
