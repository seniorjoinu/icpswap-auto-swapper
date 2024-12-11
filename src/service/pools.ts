import { Principal } from "npm:@dfinity/principal";
import { newICPSwapInfoActor, PublicPoolOverView } from "../utils/canisters/icpswap-info.ts";
import { newICPSwapPoolActor } from "../utils/canisters/icpswap-pool.ts";
import { getMyIdentity } from "../utils/identity.ts";
import { idlFactory } from "../utils/canisters/icrc1.ts";

export const DEFAULT_POOL_FEE = 3000n;
export const DEFAULT_TICK_SPACING = 60n;

let POOLS: PublicPoolOverView[] | undefined = undefined;

export async function listPools() {
  if (POOLS) return POOLS;

  const actor = await newICPSwapInfoActor();

  const pools = await actor.getAllPools();
  POOLS = pools;

  return POOLS;
}

export async function findPoolsByTickers(ticker0: string, ticker1?: string): Promise<PublicPoolOverView[]> {
  const pools = await listPools();

  const found = pools.filter((it) => {
    if (!ticker1) {
      return it.token0Symbol === ticker0 || it.token1Symbol === ticker0;
    } else {
      return (
        (it.token0Symbol === ticker0 && it.token1Symbol === ticker1) ||
        (it.token0Symbol === ticker1 && it.token1Symbol === ticker0)
      );
    }
  });

  return found;
}

export async function fetchPoolMetadata(poolId: Principal) {
  const pool = await newICPSwapPoolActor(poolId);

  return await pool.metadata();
}

export const BURN_ICP_POOL = Principal.fromText("pfaxf-iiaaa-aaaag-qkiia-cai");

export async function deposit(poolId: Principal, tokenCanId: Principal, qty: bigint, fee: bigint) {
  const pool = await newICPSwapPoolActor(poolId);

  return pool.deposit({ token: tokenCanId.toText(), amount: qty, fee });
}

export async function withdraw(poolId: Principal, tokenCanId: Principal, qty: bigint, fee: bigint) {
  const pool = await newICPSwapPoolActor(poolId);

  return await pool.withdraw({ token: tokenCanId.toText(), amount: qty, fee });
}

export async function getPoolUnusedBalance(poolId: Principal): Promise<{ balance0: bigint; balance1: bigint }> {
  const pool = await newICPSwapPoolActor(poolId);
  const id = await getMyIdentity();

  const res = await pool.getUserUnusedBalance(id.getPrincipal());

  if ("err" in res) {
    console.error(res.err);
    throw new Error();
  }

  return res.ok;
}
