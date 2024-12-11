import { PublicPoolOverView } from "./canisters/icpswap-info.ts";

export function formatPoolInfo(info: PublicPoolOverView) {
  return `${info.token0Symbol}/${info.token1Symbol} - ${info.pool} (${info.token0Id}/${info.token1Id})`;
}
