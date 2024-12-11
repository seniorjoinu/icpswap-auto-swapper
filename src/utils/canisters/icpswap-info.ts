import { Principal } from "npm:@dfinity/principal";
import { Actor, type ActorMethod } from "npm:@dfinity/agent";
import { getMyAgent } from "../identity.ts";

const CANISTER_ID = Principal.fromText("ggzvv-5qaaa-aaaag-qck7a-cai");

export const idlFactory = ({ IDL }: any) => {
  const TransactionType = IDL.Variant({
    decreaseLiquidity: IDL.Null,
    claim: IDL.Null,
    swap: IDL.Null,
    addLiquidity: IDL.Null,
    increaseLiquidity: IDL.Null,
  });
  const Transaction = IDL.Record({
    to: IDL.Text,
    action: TransactionType,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    liquidityTotal: IDL.Nat,
    from: IDL.Text,
    hash: IDL.Text,
    tick: IDL.Int,
    token1Price: IDL.Float64,
    recipient: IDL.Text,
    token0ChangeAmount: IDL.Float64,
    sender: IDL.Text,
    liquidityChange: IDL.Nat,
    token1Standard: IDL.Text,
    token0Fee: IDL.Float64,
    token1Fee: IDL.Float64,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Float64,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    amountUSD: IDL.Float64,
    amountToken0: IDL.Float64,
    amountToken1: IDL.Float64,
    poolFee: IDL.Nat,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text,
    poolId: IDL.Text,
  });
  const NatResult = IDL.Variant({ ok: IDL.Nat, err: IDL.Text });
  const PublicPoolOverView = IDL.Record({
    id: IDL.Nat,
    token0TotalVolume: IDL.Float64,
    volumeUSD1d: IDL.Float64,
    volumeUSD7d: IDL.Float64,
    token0Id: IDL.Text,
    token1Id: IDL.Text,
    token1Volume24H: IDL.Float64,
    totalVolumeUSD: IDL.Float64,
    sqrtPrice: IDL.Float64,
    pool: IDL.Text,
    tick: IDL.Int,
    liquidity: IDL.Nat,
    token1Price: IDL.Float64,
    feeTier: IDL.Nat,
    token1TotalVolume: IDL.Float64,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    token0Volume24H: IDL.Float64,
    token1Standard: IDL.Text,
    txCount: IDL.Nat,
    token1Decimals: IDL.Float64,
    token0Standard: IDL.Text,
    token0Symbol: IDL.Text,
    token0Decimals: IDL.Float64,
    token0Price: IDL.Float64,
    token1Symbol: IDL.Text,
  });
  const PublicTokenOverview = IDL.Record({
    id: IDL.Nat,
    volumeUSD1d: IDL.Float64,
    volumeUSD7d: IDL.Float64,
    totalVolumeUSD: IDL.Float64,
    name: IDL.Text,
    volumeUSD: IDL.Float64,
    feesUSD: IDL.Float64,
    priceUSDChange: IDL.Float64,
    address: IDL.Text,
    txCount: IDL.Int,
    priceUSD: IDL.Float64,
    standard: IDL.Text,
    symbol: IDL.Text,
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
  const Address = IDL.Text;
  return IDL.Service({
    addOwner: IDL.Func([IDL.Principal], [], []),
    addQuoteToken: IDL.Func([IDL.Text, IDL.Bool], [], []),
    allPoolStorage: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    allTokenStorage: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    allUserStorage: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    batchInsert: IDL.Func([IDL.Vec(Transaction)], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getAllPools: IDL.Func([], [IDL.Vec(PublicPoolOverView)], ["query"]),
    getAllTokens: IDL.Func([], [IDL.Vec(PublicTokenOverview)], ["query"]),
    getControllers: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getDataQueueSize: IDL.Func([], [IDL.Nat], ["query"]),
    getLastDataTime: IDL.Func([], [IDL.Int], ["query"]),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getPoolQueueSize: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ["query"]
    ),
    getPoolsForToken: IDL.Func(
      [IDL.Text],
      [IDL.Vec(PublicPoolOverView)],
      ["query"]
    ),
    getQuoteTokens: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getSyncLock: IDL.Func([], [IDL.Bool], ["query"]),
    getSyncStatus: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Bool, IDL.Text))],
      ["query"]
    ),
    getTokenQueueSize: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ["query"]
    ),
    getTotalVolumeAndUser: IDL.Func([], [IDL.Float64, IDL.Nat], ["query"]),
    getUserQueueSize: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Nat))],
      ["query"]
    ),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    insert: IDL.Func([Transaction], [], []),
    poolMapping: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ["query"]
    ),
    poolStorage: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
    setPoolSyncStatus: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setQuoteTokens: IDL.Func([IDL.Vec(IDL.Text), IDL.Bool], [], []),
    setTokenSyncStatus: IDL.Func([IDL.Bool], [IDL.Bool], []),
    setUserSyncStatus: IDL.Func([IDL.Bool], [IDL.Bool], []),
    syncOverview: IDL.Func([], [], []),
    tokenMapping: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ["query"]
    ),
    tokenStorage: IDL.Func([IDL.Text], [IDL.Opt(IDL.Text)], ["query"]),
    updateTokenMetadata: IDL.Func([IDL.Text, IDL.Text], [], []),
    userMapping: IDL.Func(
      [],
      [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Text))],
      ["query"]
    ),
    userStorage: IDL.Func([Address], [IDL.Opt(IDL.Text)], ["query"]),
  });
};

export type Address = string;
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
export interface PublicPoolOverView {
  id: bigint;
  token0TotalVolume: number;
  volumeUSD1d: number;
  volumeUSD7d: number;
  token0Id: string;
  token1Id: string;
  token1Volume24H: number;
  totalVolumeUSD: number;
  sqrtPrice: number;
  pool: string;
  tick: bigint;
  liquidity: bigint;
  token1Price: number;
  feeTier: bigint;
  token1TotalVolume: number;
  volumeUSD: number;
  feesUSD: number;
  token0Volume24H: number;
  token1Standard: string;
  txCount: bigint;
  token1Decimals: number;
  token0Standard: string;
  token0Symbol: string;
  token0Decimals: number;
  token0Price: number;
  token1Symbol: string;
}
export interface PublicTokenOverview {
  id: bigint;
  volumeUSD1d: number;
  volumeUSD7d: number;
  totalVolumeUSD: number;
  name: string;
  volumeUSD: number;
  feesUSD: number;
  priceUSDChange: number;
  address: string;
  txCount: bigint;
  priceUSD: number;
  standard: string;
  symbol: string;
}
export interface StreamingCallbackHttpResponse {
  token: [] | [Token];
  body: Uint8Array | number[];
}
export type StreamingStrategy = { Callback: CallbackStrategy };
export interface Token {
  arbitrary_data: string;
}
export interface Transaction {
  to: string;
  action: TransactionType;
  token0Id: string;
  token1Id: string;
  liquidityTotal: bigint;
  from: string;
  hash: string;
  tick: bigint;
  token1Price: number;
  recipient: string;
  token0ChangeAmount: number;
  sender: string;
  liquidityChange: bigint;
  token1Standard: string;
  token0Fee: number;
  token1Fee: number;
  timestamp: bigint;
  token1ChangeAmount: number;
  token1Decimals: number;
  token0Standard: string;
  amountUSD: number;
  amountToken0: number;
  amountToken1: number;
  poolFee: bigint;
  token0Symbol: string;
  token0Decimals: number;
  token0Price: number;
  token1Symbol: string;
  poolId: string;
}
export type TransactionType =
  | { decreaseLiquidity: null }
  | { claim: null }
  | { swap: null }
  | { addLiquidity: null }
  | { increaseLiquidity: null };
export interface _SERVICE {
  addOwner: ActorMethod<[Principal], undefined>;
  addQuoteToken: ActorMethod<[string, boolean], undefined>;
  allPoolStorage: ActorMethod<[], Array<string>>;
  allTokenStorage: ActorMethod<[], Array<string>>;
  allUserStorage: ActorMethod<[], Array<string>>;
  batchInsert: ActorMethod<[Array<Transaction>], undefined>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getAllPools: ActorMethod<[], Array<PublicPoolOverView>>;
  getAllTokens: ActorMethod<[], Array<PublicTokenOverview>>;
  getControllers: ActorMethod<[], Array<Principal>>;
  getDataQueueSize: ActorMethod<[], bigint>;
  getLastDataTime: ActorMethod<[], bigint>;
  getOwners: ActorMethod<[], Array<Principal>>;
  getPoolQueueSize: ActorMethod<[], Array<[string, bigint]>>;
  getPoolsForToken: ActorMethod<[string], Array<PublicPoolOverView>>;
  getQuoteTokens: ActorMethod<[], Array<string>>;
  getSyncLock: ActorMethod<[], boolean>;
  getSyncStatus: ActorMethod<[], Array<[string, boolean, string]>>;
  getTokenQueueSize: ActorMethod<[], Array<[string, bigint]>>;
  getTotalVolumeAndUser: ActorMethod<[], [number, bigint]>;
  getUserQueueSize: ActorMethod<[], Array<[string, bigint]>>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  insert: ActorMethod<[Transaction], undefined>;
  poolMapping: ActorMethod<[], Array<[string, string]>>;
  poolStorage: ActorMethod<[string], [] | [string]>;
  setPoolSyncStatus: ActorMethod<[boolean], boolean>;
  setQuoteTokens: ActorMethod<[Array<string>, boolean], undefined>;
  setTokenSyncStatus: ActorMethod<[boolean], boolean>;
  setUserSyncStatus: ActorMethod<[boolean], boolean>;
  syncOverview: ActorMethod<[], undefined>;
  tokenMapping: ActorMethod<[], Array<[string, string]>>;
  tokenStorage: ActorMethod<[string], [] | [string]>;
  updateTokenMetadata: ActorMethod<[string, string], undefined>;
  userMapping: ActorMethod<[], Array<[string, string]>>;
  userStorage: ActorMethod<[Address], [] | [string]>;
}

export async function newICPSwapInfoActor(): Promise<_SERVICE> {
  return Actor.createActor(idlFactory, {
    canisterId: CANISTER_ID,
    agent: await getMyAgent(),
  });
}
