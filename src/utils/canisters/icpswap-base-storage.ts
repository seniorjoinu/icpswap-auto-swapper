import type { Principal } from "npm:@dfinity/principal";
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
  const RecordPage = IDL.Record({
    content: IDL.Vec(Transaction),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
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
    addOwners: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    batchInsert: IDL.Func([IDL.Vec(Transaction)], [], []),
    cycleAvailable: IDL.Func([], [NatResult], []),
    cycleBalance: IDL.Func([], [NatResult], ["query"]),
    getBaseRecord: IDL.Func([IDL.Nat, IDL.Nat, IDL.Vec(IDL.Text)], [RecordPage], ["query"]),
    getByPool: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [RecordPage], ["query"]),
    getByToken: IDL.Func([IDL.Nat, IDL.Nat, IDL.Text], [RecordPage], ["query"]),
    getFirstBlock: IDL.Func([], [IDL.Nat], ["query"]),
    getOwners: IDL.Func([], [IDL.Vec(IDL.Principal)], []),
    getPools: IDL.Func([], [IDL.Vec(IDL.Tuple(IDL.Text, PoolBaseInfo))], ["query"]),
    getTx: IDL.Func([IDL.Nat, IDL.Nat], [RecordPage], ["query"]),
    getTxCount: IDL.Func([], [IDL.Nat], ["query"]),
    http_request: IDL.Func([HttpRequest], [HttpResponse], ["query"]),
    insert: IDL.Func([Transaction], [], []),
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
export interface RecordPage {
  content: Array<Transaction>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
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
  | { transferPosition: bigint }
  | { increaseLiquidity: null };
export interface _SERVICE {
  addOwners: ActorMethod<[Array<Principal>], undefined>;
  batchInsert: ActorMethod<[Array<Transaction>], undefined>;
  cycleAvailable: ActorMethod<[], NatResult>;
  cycleBalance: ActorMethod<[], NatResult>;
  getBaseRecord: ActorMethod<[bigint, bigint, Array<string>], RecordPage>;
  getByPool: ActorMethod<[bigint, bigint, string], RecordPage>;
  getByToken: ActorMethod<[bigint, bigint, string], RecordPage>;
  getFirstBlock: ActorMethod<[], bigint>;
  getOwners: ActorMethod<[], Array<Principal>>;
  getPools: ActorMethod<[], Array<[string, PoolBaseInfo]>>;
  getTx: ActorMethod<[bigint, bigint], RecordPage>;
  getTxCount: ActorMethod<[], bigint>;
  http_request: ActorMethod<[HttpRequest], HttpResponse>;
  insert: ActorMethod<[Transaction], undefined>;
}

export async function newICPSwapBaseStorageActor(cid: Principal): Promise<_SERVICE> {
  return Actor.createActor(idlFactory, {
    canisterId: cid,
    agent: await getMyAgent(),
  });
}
