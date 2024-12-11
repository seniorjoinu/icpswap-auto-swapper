import { Principal } from "npm:@dfinity/principal";
import { Actor, type ActorMethod } from "npm:@dfinity/agent";
import { getMyAgent } from "../identity.ts";

export const idlFactory = ({ IDL }: any) => {
  const TransactionType = IDL.Variant({
    decreaseLiquidity: IDL.Null,
    claim: IDL.Null,
    swap: IDL.Null,
    addLiquidity: IDL.Null,
    transferPosition: IDL.Nat,
    increaseLiquidity: IDL.Null,
  });
  const SwapRecordInfo__1 = IDL.Record({
    to: IDL.Text,
    feeAmount: IDL.Int,
    action: TransactionType,
    feeAmountTotal: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token0AmountTotal: IDL.Nat,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    tick: IDL.Int,
    feeTire: IDL.Nat,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Nat,
    token1AmountTotal: IDL.Nat,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Nat,
    token1Fee: IDL.Nat,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Nat,
    token0Standard: IDL.Text,
    price: IDL.Nat,
    poolId: IDL.Text,
  });
  const PoolTvlData = IDL.Record({
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    pool: IDL.Text,
    tvlUSD: IDL.Float64,
    token0Symbol: IDL.Text,
    token1Symbol: IDL.Text,
  });
  const SwapRecordInfo = IDL.Record({
    to: IDL.Text,
    feeAmount: IDL.Int,
    action: TransactionType,
    feeAmountTotal: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token0AmountTotal: IDL.Nat,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    tick: IDL.Int,
    feeTire: IDL.Nat,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Nat,
    token1AmountTotal: IDL.Nat,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Nat,
    token1Fee: IDL.Nat,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Nat,
    token0Standard: IDL.Text,
    price: IDL.Nat,
    poolId: IDL.Text,
  });
  const SwapErrorInfo = IDL.Record({
    data: SwapRecordInfo,
    error: IDL.Text,
    timestamp: IDL.Int,
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PoolBaseInfo = IDL.Record({
    fee: IDL.Int,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    pool: IDL.Text,
    token1Standard: IDL.Text,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token1Symbol: IDL.Text,
  });
  const TokenPrice = IDL.Record({
    tokenId: IDL.Text,
    volumeUSD7d: IDL.Float64,
    priceICP: IDL.Float64,
    priceUSD: IDL.Float64,
  });
  const HeaderField = IDL.Tuple(IDL.Text, IDL.Text);
  const HttpRequest = IDL.Record({
    url: IDL.Text,
    method: IDL.Text,
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
  });
  const Token = IDL.Record({ arbitrary_data: IDL.Text });
  const StreamingCallbackHttpResponse = IDL.Record({
    token: IDL.Opt(Token),
    body: IDL.Vec(IDL.Nat8),
  });
  const CallbackStrategy = IDL.Record({
    token: Token,
    callback: IDL.Func([Token], [StreamingCallbackHttpResponse], ["query"]),
  });
  const StreamingStrategy = IDL.Variant({ Callback: CallbackStrategy });
  const HttpResponse = IDL.Record({
    body: IDL.Vec(IDL.Nat8),
    headers: IDL.Vec(HeaderField),
    upgrade: IDL.Opt(IDL.Bool),
    streaming_strategy: IDL.Opt(StreamingStrategy),
    status_code: IDL.Nat16,
  });
  return IDL.Service({
    addClient: IDL.Func([IDL.Principal], [], []),
    baseLastStorage: IDL.Func([], [IDL.Text], ["query"]),
    baseStorage: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    batchPush: IDL.Func([IDL.Vec(SwapRecordInfo__1)], [], []),
    batchUpdatePoolTvl: IDL.Func([IDL.Vec(PoolTvlData)], [], []),
    batchUpdateTokenPrice7dVolumeUSD: IDL.Func([IDL.Vec(IDL.Tuple(IDL.Text, IDL.Float64))], [], []),
    cleanErrorData: IDL.Func([], [IDL.Vec(SwapErrorInfo)], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAllPools: IDL.Func([], [IDL.Vec(PoolBaseInfo)], ["query"]),
    getAllowTokens: IDL.Func([], [IDL.Vec(IDL.Text)], []),
    getClients: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getControllers: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getDataQueue: IDL.Func([], [IDL.Vec(SwapRecordInfo__1)], ["query"]),
    getErrorData: IDL.Func([], [IDL.Vec(SwapErrorInfo)], ["query"]),
    getPoolLastPrice: IDL.Func([IDL.Principal], [IDL.Float64], ["query"]),
    getPoolLastPriceTime: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Int))], ["query"]),
    getPoolTvl: IDL.Func([], [IDL.Vec(PoolTvlData)], ["query"]),
    getQuoteTokens: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getStorageCount: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat)), IDL.Int], ["query"]),
    getSyncError: IDL.Func([], [IDL.Text], ["query"]),
    getSyncLock: IDL.Func([], [IDL.Bool], ["query"]),
    getTokenPriceMetadata: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, TokenPrice))], ["query"]),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    initStorageCount: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))], []),
    push: IDL.Func([SwapRecordInfo__1], [], []),
    removeTokenMetadata: IDL.Func([IDL.Principal], [], []),
    retryErrorData: IDL.Func([], [IDL.Vec(SwapErrorInfo)], []),
    setQuoteTokens: IDL.Func([IDL.Vec(IDL.Text), IDL.Bool], [], []),
    updateMiniProportion: IDL.Func([IDL.Float64], [], []),
    updateTokenMetadata: IDL.Func([IDL.Principal, IDL.Text, IDL.Nat], [], []),
  });
};

export interface CallbackStrategy {
  token: Token;
  callback: [Principal, string];
}
export type HeaderField = [string, string];
export interface HttpRequest {
  url: string;
  method: string;
  body: Uint8Array | number[];
  headers: Array<HeaderField>;
}
export interface HttpResponse {
  body: Uint8Array | number[];
  headers: Array<HeaderField>;
  upgrade: [] | [boolean];
  streaming_strategy: [] | [StreamingStrategy];
  status_code: number;
}
export type NatResult = { ok: bigint } | { err: string };
export interface PoolBaseInfo {
  fee: bigint;
  token0Id: string;
  token1Id: string;
  pool: string;
  token1Standard: string;
  token1Decimals: number;
  token0Standard: string;
  token0Symbol: string;
  token0Decimals: number;
  token1Symbol: string;
}
export interface PoolTvlData {
  token0Id: string;
  token1Id: string;
  pool: string;
  tvlUSD: number;
  token0Symbol: string;
  token1Symbol: string;
}
export interface StreamingCallbackHttpResponse {
  token: [] | [Token];
  body: Uint8Array | number[];
}
export type StreamingStrategy = { Callback: CallbackStrategy };
export interface SwapErrorInfo {
  data: SwapRecordInfo;
  error: string;
  timestamp: bigint;
}
export interface SwapRecordInfo {
  to: string;
  feeAmount: bigint;
  action: TransactionType;
  feeAmountTotal: bigint;
  token0Id: string;
  token1Id: string;
  token0AmountTotal: bigint;
  liquidityTotal: bigint;
  from: string;
  tick: bigint;
  feeTire: bigint;
  recipient: string;
  token0ChangeAmount: bigint;
  token1AmountTotal: bigint;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: bigint;
  token1Fee: bigint;
  timestamp: bigint;
  token1ChangeAmount: bigint;
  token0Standard: string;
  price: bigint;
  poolId: string;
}
export interface SwapRecordInfo__1 {
  to: string;
  feeAmount: bigint;
  action: TransactionType;
  feeAmountTotal: bigint;
  token0Id: string;
  token1Id: string;
  token0AmountTotal: bigint;
  liquidityTotal: bigint;
  from: string;
  tick: bigint;
  feeTire: bigint;
  recipient: string;
  token0ChangeAmount: bigint;
  token1AmountTotal: bigint;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: bigint;
  token1Fee: bigint;
  timestamp: bigint;
  token1ChangeAmount: bigint;
  token0Standard: string;
  price: bigint;
  poolId: string;
}
export interface Token {
  arbitrary_data: string;
}
export interface TokenPrice {
  tokenId: string;
  volumeUSD7d: number;
  priceICP: number;
  priceUSD: number;
}
export type TransactionType =
  | { decreaseLiquidity: null }
  | { claim: null }
  | { swap: null }
  | { addLiquidity: null }
  | { transferPosition: bigint }
  | { increaseLiquidity: null };
export interface _SERVICE {
  addClient: ActorMethod<[Principal], undefined>;
  baseLastStorage: ActorMethod<[], string>;
  baseStorage: ActorMethod<[], Array<string>>;
  batchPush: ActorMethod<[Array<SwapRecordInfo__1>], undefined>;
  batchUpdatePoolTvl: ActorMethod<[Array<PoolTvlData>], undefined>;
  batchUpdateTokenPrice7dVolumeUSD: ActorMethod<[Array<[string, number]>], undefined>;
  cleanErrorData: ActorMethod<[], Array<SwapErrorInfo>>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getAllPools: ActorMethod<[], Array<PoolBaseInfo>>;
  getAllowTokens: ActorMethod<[], Array<string>>;
  getClients: ActorMethod<[], Array<Principal>>;
  getControllers: ActorMethod<[], Array<Principal>>;
  getDataQueue: ActorMethod<[], Array<SwapRecordInfo__1>>;
  getErrorData: ActorMethod<[], Array<SwapErrorInfo>>;
  getPoolLastPrice: ActorMethod<[Principal], number>;
  getPoolLastPriceTime: ActorMethod<[], Array<[string, bigint]>>;
  getPoolTvl: ActorMethod<[], Array<PoolTvlData>>;
  getQuoteTokens: ActorMethod<[], Array<string>>;
  getStorageCount: ActorMethod<[], [Array<[string, bigint]>, bigint]>;
  getSyncError: ActorMethod<[], string>;
  getSyncLock: ActorMethod<[], boolean>;
  getTokenPriceMetadata: ActorMethod<[], Array<[string, TokenPrice]>>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  initStorageCount: ActorMethod<[], Array<[string, bigint]>>;
  push: ActorMethod<[SwapRecordInfo__1], undefined>;
  removeTokenMetadata: ActorMethod<[Principal], undefined>;
  retryErrorData: ActorMethod<[], Array<SwapErrorInfo>>;
  setQuoteTokens: ActorMethod<[Array<string>, boolean], undefined>;
  updateMiniProportion: ActorMethod<[number], undefined>;
  updateTokenMetadata: ActorMethod<[Principal, string, bigint], undefined>;
}

export async function newICPSwapBaseIndexActor(): Promise<_SERVICE> {
  return Actor.createActor(idlFactory, {
    canisterId: Principal.fromText("g54jq-hiaaa-aaaag-qck5q-cai"),
    agent: await getMyAgent(),
  });
}
