export const Q192 = 2n ** 192n;
export const Q96 = 2n ** 96n;

export function approxAmount1(amount0: bigint, sqrtPriceX96: bigint): bigint {
  return (sqrtPriceX96 ** 2n * amount0) / Q192;
}

export function approxAmount0(amount1: bigint, sqrtPriceX96: bigint): bigint {
  return (amount1 * Q192) / sqrtPriceX96 ** 2n;
}
