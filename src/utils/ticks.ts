import { panic } from "./index.ts";

export interface ITickBoundaries {
  lower: bigint;
  upper: bigint;
}

export type TBoundaryMode = "both" | "token0" | "token1";
export type TPoolBalances = { token0: bigint; token1: bigint };

export function calcMode(balances: TPoolBalances): TBoundaryMode {
  if (balances.token0 > 0n && balances.token1 > 0n) return "both";
  if (balances.token0 > 0n) return "token0";
  if (balances.token1 > 0n) return "token1";

  panic("unreacheable");
}

const POSITION_TICK_SPAN_ONE_SIDE = 2n;

export function calcTickBoundaries(curTick: bigint, tickSpacing: bigint, mode: TBoundaryMode): ITickBoundaries {
  let lower = (curTick / tickSpacing) * tickSpacing;
  let upper = lower + tickSpacing;

  if (curTick <= 0n) {
    lower -= tickSpacing;
    upper -= tickSpacing;
  }

  switch (mode) {
    case "both":
      lower -= tickSpacing * POSITION_TICK_SPAN_ONE_SIDE;
      upper += tickSpacing * POSITION_TICK_SPAN_ONE_SIDE;

      break;

    case "token0":
      lower += tickSpacing;
      upper += tickSpacing;
      break;

    case "token1":
      lower -= tickSpacing;
      upper -= tickSpacing;
      break;
  }

  return { lower, upper };
}

export function positionIsInPlace(
  boundaries: ITickBoundaries,
  targetTick: bigint,
  mode: TBoundaryMode,
  tickSpacing: bigint
): boolean {
  // if target tick is within boundaries, return true with no respect to the mode
  if (mode === "both" && targetTick >= boundaries.lower && targetTick <= boundaries.upper) {
    return true;
  }

  if (mode === "both") {
    return false;
  } else {
    return true;
  }

  // if the position only contains token0, and the boundary is exactly one segment upper - return true
  if (
    mode === "token0" &&
    targetTick >= boundaries.lower - tickSpacing &&
    targetTick <= boundaries.upper - tickSpacing
  ) {
    return true;
  }

  // if the position only contains token1, and the boundary is exactly one segment lower - return true
  if (
    mode === "token1" &&
    targetTick >= boundaries.lower + tickSpacing &&
    targetTick <= boundaries.upper + tickSpacing
  ) {
    return true;
  }

  return false;
}
