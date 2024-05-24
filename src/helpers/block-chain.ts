// convert hexadecimal to WEI value
const convertToWEI = (hexadecimal: string) =>
  hexadecimal.length ? parseInt(hexadecimal, 16) : '';

export { convertToWEI };

/**
 * one ETH is equal to 1,000,000,000,000,000,000 wei i.e. 1 ETH -  (10^18) wei
 * assumption
 * 1 ETH - $5,000 USD
 */
