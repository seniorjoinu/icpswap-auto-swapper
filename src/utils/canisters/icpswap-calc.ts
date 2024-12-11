import { Actor, type ActorMethod } from "npm:@dfinity/agent";
import { Principal } from "npm:@dfinity/principal";
import { getMyAgent } from "../identity.ts";

export const idlFactory = ({ IDL }: any) => {
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result = IDL.Variant({ ok: CycleInfo, err: Error });
  return IDL.Service({
    getCycleInfo: IDL.Func([], [Result], []),
    getPositionTokenAmount: IDL.Func(
      [IDL.Nat, IDL.Int, IDL.Int, IDL.Int, IDL.Nat, IDL.Nat],
      [IDL.Record({ amount0: IDL.Int, amount1: IDL.Int })],
      ["query"]
    ),
    getPrice: IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat], [IDL.Float64], ["query"]),
    getSqrtPriceX96: IDL.Func([IDL.Float64, IDL.Float64, IDL.Float64], [IDL.Int], ["query"]),
    getTokenAmountByLiquidity: IDL.Func(
      [IDL.Nat, IDL.Int, IDL.Int, IDL.Nat],
      [IDL.Record({ amount0: IDL.Int, amount1: IDL.Int })],
      ["query"]
    ),
    priceToTick: IDL.Func([IDL.Float64, IDL.Nat], [IDL.Int], ["query"]),
    sortToken: IDL.Func([IDL.Text, IDL.Text], [IDL.Text, IDL.Text], ["query"]),
  });
};

export interface CycleInfo {
  balance: bigint;
  available: bigint;
}
export type Error =
  | { CommonError: null }
  | { InternalError: string }
  | { UnsupportedToken: string }
  | { InsufficientFunds: null };
export type Result = { ok: CycleInfo } | { err: Error };
export interface _SERVICE {
  getCycleInfo: ActorMethod<[], Result>;
  getPositionTokenAmount: ActorMethod<
    [bigint, bigint, bigint, bigint, bigint, bigint],
    { amount0: bigint; amount1: bigint }
  >;
  getPrice: ActorMethod<[bigint, bigint, bigint], number>;
  getSqrtPriceX96: ActorMethod<[number, number, number], bigint>;
  getTokenAmountByLiquidity: ActorMethod<[bigint, bigint, bigint, bigint], { amount0: bigint; amount1: bigint }>;
  priceToTick: ActorMethod<[number, bigint], bigint>;
  sortToken: ActorMethod<[string, string], [string, string]>;
}

const CANISTER_ID = Principal.fromText("phr2m-oyaaa-aaaag-qjuoq-cai");

export async function newICPSwapCalcActor(): Promise<_SERVICE> {
  return Actor.createActor(idlFactory, { canisterId: CANISTER_ID, agent: await getMyAgent() });
}
