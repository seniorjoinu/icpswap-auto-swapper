import type { Principal } from "npm:@dfinity/principal";
import type { IDL } from "npm:@dfinity/candid";
import { Actor, ActorMethod } from "npm:@dfinity/agent";
import { getMyAgent } from "../identity.ts";

export const idlFactory = ({ IDL }: any) => {
  const AccountBalance = IDL.Record({
    balance0: IDL.Nat,
    balance1: IDL.Nat,
  });
  const Page_5 = IDL.Record({
    content: IDL.Vec(IDL.Tuple(IDL.Principal, AccountBalance)),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Error = IDL.Variant({
    CommonError: IDL.Null,
    InternalError: IDL.Text,
    UnsupportedToken: IDL.Text,
    InsufficientFunds: IDL.Null,
  });
  const Result_31 = IDL.Variant({ ok: Page_5, err: Error });
  const Result_10 = IDL.Variant({ ok: IDL.Bool, err: Error });
  const Result_30 = IDL.Variant({
    ok: IDL.Record({
      tokenIncome: IDL.Vec(IDL.Tuple(IDL.Nat, IDL.Record({ tokensOwed0: IDL.Nat, tokensOwed1: IDL.Nat }))),
      totalTokensOwed0: IDL.Nat,
      totalTokensOwed1: IDL.Nat,
    }),
    err: Error,
  });
  const ClaimArgs = IDL.Record({ positionId: IDL.Nat });
  const Result_29 = IDL.Variant({
    ok: IDL.Record({ amount0: IDL.Nat, amount1: IDL.Nat }),
    err: Error,
  });
  const DecreaseLiquidityArgs = IDL.Record({
    liquidity: IDL.Text,
    positionId: IDL.Nat,
  });
  const DepositArgs = IDL.Record({
    fee: IDL.Nat,
    token: IDL.Text,
    amount: IDL.Nat,
  });
  const Result_9 = IDL.Variant({ ok: IDL.Nat, err: Error });
  const DepositAndMintArgs = IDL.Record({
    tickUpper: IDL.Int,
    fee0: IDL.Nat,
    fee1: IDL.Nat,
    amount0: IDL.Nat,
    amount1: IDL.Nat,
    positionOwner: IDL.Principal,
    amount0Desired: IDL.Text,
    amount1Desired: IDL.Text,
    tickLower: IDL.Int,
  });
  const CycleInfo = IDL.Record({ balance: IDL.Nat, available: IDL.Nat });
  const Result_8 = IDL.Variant({ ok: CycleInfo, err: Error });
  const Token = IDL.Record({ address: IDL.Text, standard: IDL.Text });
  const GetPositionArgs = IDL.Record({
    tickUpper: IDL.Int,
    tickLower: IDL.Int,
  });
  const PositionInfo = IDL.Record({
    tokensOwed0: IDL.Nat,
    tokensOwed1: IDL.Nat,
    feeGrowthInside1LastX128: IDL.Nat,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
  });
  const Result_28 = IDL.Variant({ ok: PositionInfo, err: Error });
  const PositionInfoWithId = IDL.Record({
    id: IDL.Text,
    tokensOwed0: IDL.Nat,
    tokensOwed1: IDL.Nat,
    feeGrowthInside1LastX128: IDL.Nat,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
  });
  const Page_4 = IDL.Record({
    content: IDL.Vec(PositionInfoWithId),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_27 = IDL.Variant({ ok: Page_4, err: Error });
  const TransactionType = IDL.Variant({
    decreaseLiquidity: IDL.Null,
    claim: IDL.Null,
    swap: IDL.Null,
    addLiquidity: IDL.Null,
    increaseLiquidity: IDL.Null,
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
    TVLToken0: IDL.Int,
    TVLToken1: IDL.Int,
    token0Fee: IDL.Nat,
    token1Fee: IDL.Nat,
    timestamp: IDL.Int,
    token1ChangeAmount: IDL.Nat,
    token0Standard: IDL.Text,
    price: IDL.Nat,
    poolId: IDL.Text,
  });
  const PushError = IDL.Record({ time: IDL.Int, message: IDL.Text });
  const Result_26 = IDL.Variant({
    ok: IDL.Record({
      infoCid: IDL.Text,
      records: IDL.Vec(SwapRecordInfo),
      errors: IDL.Vec(PushError),
      retryCount: IDL.Nat,
    }),
    err: Error,
  });
  const TickLiquidityInfo = IDL.Record({
    tickIndex: IDL.Int,
    price0Decimal: IDL.Nat,
    liquidityNet: IDL.Int,
    price0: IDL.Nat,
    price1: IDL.Nat,
    liquidityGross: IDL.Nat,
    price1Decimal: IDL.Nat,
  });
  const Page_3 = IDL.Record({
    content: IDL.Vec(TickLiquidityInfo),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_25 = IDL.Variant({ ok: Page_3, err: Error });
  const TickInfoWithId = IDL.Record({
    id: IDL.Text,
    initialized: IDL.Bool,
    feeGrowthOutside1X128: IDL.Nat,
    secondsPerLiquidityOutsideX128: IDL.Nat,
    liquidityNet: IDL.Int,
    secondsOutside: IDL.Nat,
    liquidityGross: IDL.Nat,
    feeGrowthOutside0X128: IDL.Nat,
    tickCumulativeOutside: IDL.Int,
  });
  const Page_2 = IDL.Record({
    content: IDL.Vec(TickInfoWithId),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_24 = IDL.Variant({ ok: Page_2, err: Error });
  const Result_23 = IDL.Variant({
    ok: IDL.Record({
      swapFee0Repurchase: IDL.Nat,
      token0Amount: IDL.Nat,
      swapFeeReceiver: IDL.Text,
      token1Amount: IDL.Nat,
      swapFee1Repurchase: IDL.Nat,
    }),
    err: Error,
  });
  const Value = IDL.Variant({
    Int: IDL.Int,
    Nat: IDL.Nat,
    Blob: IDL.Vec(IDL.Nat8),
    Text: IDL.Text,
  });
  const TransferLog = IDL.Record({
    to: IDL.Principal,
    fee: IDL.Nat,
    result: IDL.Text,
    token: Token,
    action: IDL.Text,
    daysFrom19700101: IDL.Nat,
    owner: IDL.Principal,
    from: IDL.Principal,
    fromSubaccount: IDL.Opt(IDL.Vec(IDL.Nat8)),
    timestamp: IDL.Nat,
    index: IDL.Nat,
    amount: IDL.Nat,
    errorMsg: IDL.Text,
  });
  const Result_22 = IDL.Variant({ ok: IDL.Vec(TransferLog), err: Error });
  const Result = IDL.Variant({ ok: IDL.Text, err: Error });
  const UserPositionInfo = IDL.Record({
    tickUpper: IDL.Int,
    tokensOwed0: IDL.Nat,
    tokensOwed1: IDL.Nat,
    feeGrowthInside1LastX128: IDL.Nat,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
    tickLower: IDL.Int,
  });
  const Result_21 = IDL.Variant({ ok: UserPositionInfo, err: Error });
  const Result_20 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Text, IDL.Vec(IDL.Nat))),
    err: Error,
  });
  const Result_19 = IDL.Variant({ ok: IDL.Vec(IDL.Nat), err: Error });
  const UserPositionInfoWithTokenAmount = IDL.Record({
    id: IDL.Nat,
    tickUpper: IDL.Int,
    tokensOwed0: IDL.Nat,
    tokensOwed1: IDL.Nat,
    feeGrowthInside1LastX128: IDL.Nat,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
    token0Amount: IDL.Nat,
    token1Amount: IDL.Nat,
    tickLower: IDL.Int,
  });
  const Page_1 = IDL.Record({
    content: IDL.Vec(UserPositionInfoWithTokenAmount),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_18 = IDL.Variant({ ok: Page_1, err: Error });
  const UserPositionInfoWithId = IDL.Record({
    id: IDL.Nat,
    tickUpper: IDL.Int,
    tokensOwed0: IDL.Nat,
    tokensOwed1: IDL.Nat,
    feeGrowthInside1LastX128: IDL.Nat,
    liquidity: IDL.Nat,
    feeGrowthInside0LastX128: IDL.Nat,
    tickLower: IDL.Int,
  });
  const Page = IDL.Record({
    content: IDL.Vec(UserPositionInfoWithId),
    offset: IDL.Nat,
    limit: IDL.Nat,
    totalElements: IDL.Nat,
  });
  const Result_17 = IDL.Variant({ ok: Page, err: Error });
  const Result_16 = IDL.Variant({
    ok: IDL.Vec(UserPositionInfoWithId),
    err: Error,
  });
  const Result_15 = IDL.Variant({
    ok: IDL.Record({ balance0: IDL.Nat, balance1: IDL.Nat }),
    err: Error,
  });
  const WithdrawErrorLog = IDL.Record({
    token: Token,
    time: IDL.Int,
    user: IDL.Principal,
    amount: IDL.Nat,
  });
  const Result_14 = IDL.Variant({
    ok: IDL.Vec(IDL.Tuple(IDL.Nat, WithdrawErrorLog)),
    err: Error,
  });
  const IncreaseLiquidityArgs = IDL.Record({
    positionId: IDL.Nat,
    amount0Desired: IDL.Text,
    amount1Desired: IDL.Text,
  });
  const PoolMetadata = IDL.Record({
    fee: IDL.Nat,
    key: IDL.Text,
    sqrtPriceX96: IDL.Nat,
    tick: IDL.Int,
    liquidity: IDL.Nat,
    token0: Token,
    token1: Token,
    maxLiquidityPerTick: IDL.Nat,
    nextPositionId: IDL.Nat,
  });
  const Result_13 = IDL.Variant({ ok: PoolMetadata, err: Error });
  const MintArgs = IDL.Record({
    fee: IDL.Nat,
    tickUpper: IDL.Int,
    token0: IDL.Text,
    token1: IDL.Text,
    amount0Desired: IDL.Text,
    amount1Desired: IDL.Text,
    tickLower: IDL.Int,
  });
  const SwapArgs = IDL.Record({
    amountIn: IDL.Text,
    zeroForOne: IDL.Bool,
    amountOutMinimum: IDL.Text,
  });
  const Result_12 = IDL.Variant({
    ok: IDL.Record({ tokensOwed0: IDL.Nat, tokensOwed1: IDL.Nat }),
    err: Error,
  });
  const Result_11 = IDL.Variant({ ok: IDL.Int, err: Error });
  const WithdrawArgs = IDL.Record({
    fee: IDL.Nat,
    token: IDL.Text,
    amount: IDL.Nat,
  });
  return IDL.Service({
    allTokenBalance: IDL.Func([IDL.Nat, IDL.Nat], [Result_31], ["query"]),
    approvePosition: IDL.Func([IDL.Principal, IDL.Nat], [Result_10], []),
    batchRefreshIncome: IDL.Func([IDL.Vec(IDL.Nat)], [Result_30], ["query"]),
    checkOwnerOfUserPosition: IDL.Func([IDL.Principal, IDL.Nat], [Result_10], ["query"]),
    claim: IDL.Func([ClaimArgs], [Result_29], []),
    decreaseLiquidity: IDL.Func([DecreaseLiquidityArgs], [Result_29], []),
    deposit: IDL.Func([DepositArgs], [Result_9], []),
    depositAllAndMint: IDL.Func([DepositAndMintArgs], [Result_9], []),
    depositFrom: IDL.Func([DepositArgs], [Result_9], []),
    getAdmins: IDL.Func([], [IDL.Vec(IDL.Principal)], ["query"]),
    getAvailabilityState: IDL.Func(
      [],
      [
        IDL.Record({
          whiteList: IDL.Vec(IDL.Principal),
          available: IDL.Bool,
        }),
      ],
      ["query"]
    ),
    getClaimLog: IDL.Func([], [IDL.Vec(IDL.Text)], ["query"]),
    getCycleInfo: IDL.Func([], [Result_8], []),
    getMistransferBalance: IDL.Func([Token], [Result_9], []),
    getPosition: IDL.Func([GetPositionArgs], [Result_28], ["query"]),
    getPositions: IDL.Func([IDL.Nat, IDL.Nat], [Result_27], ["query"]),
    getSwapRecordState: IDL.Func([], [Result_26], ["query"]),
    getTickInfos: IDL.Func([IDL.Nat, IDL.Nat], [Result_25], ["query"]),
    getTicks: IDL.Func([IDL.Nat, IDL.Nat], [Result_24], ["query"]),
    getTokenAmountState: IDL.Func([], [Result_23], ["query"]),
    getTokenBalance: IDL.Func([], [IDL.Record({ token0: IDL.Nat, token1: IDL.Nat })], []),
    getTokenMeta: IDL.Func(
      [],
      [
        IDL.Record({
          token0: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
          token1: IDL.Vec(IDL.Tuple(IDL.Text, Value)),
        }),
      ],
      []
    ),
    getTransferLogs: IDL.Func([], [Result_22], ["query"]),
    getUserByPositionId: IDL.Func([IDL.Nat], [Result], ["query"]),
    getUserPosition: IDL.Func([IDL.Nat], [Result_21], ["query"]),
    getUserPositionIds: IDL.Func([], [Result_20], ["query"]),
    getUserPositionIdsByPrincipal: IDL.Func([IDL.Principal], [Result_19], ["query"]),
    getUserPositionWithTokenAmount: IDL.Func([IDL.Nat, IDL.Nat], [Result_18], ["query"]),
    getUserPositions: IDL.Func([IDL.Nat, IDL.Nat], [Result_17], ["query"]),
    getUserPositionsByPrincipal: IDL.Func([IDL.Principal], [Result_16], ["query"]),
    getUserUnusedBalance: IDL.Func([IDL.Principal], [Result_15], ["query"]),
    getVersion: IDL.Func([], [IDL.Text], ["query"]),
    getWithdrawErrorLog: IDL.Func([], [Result_14], ["query"]),
    increaseLiquidity: IDL.Func([IncreaseLiquidityArgs], [Result_9], []),
    init: IDL.Func([IDL.Nat, IDL.Int, IDL.Nat], [], []),
    metadata: IDL.Func([], [Result_13], ["query"]),
    mint: IDL.Func([MintArgs], [Result_9], []),
    quote: IDL.Func([SwapArgs], [Result_9], ["query"]),
    quoteForAll: IDL.Func([SwapArgs], [Result_9], ["query"]),
    refreshIncome: IDL.Func([IDL.Nat], [Result_12], ["query"]),
    removeErrorTransferLog: IDL.Func([IDL.Nat, IDL.Bool], [], []),
    removeWithdrawErrorLog: IDL.Func([IDL.Nat, IDL.Bool], [], []),
    resetTokenAmountState: IDL.Func([IDL.Nat, IDL.Nat, IDL.Nat, IDL.Nat], [], []),
    setAdmins: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    setAvailable: IDL.Func([IDL.Bool], [], []),
    setWhiteList: IDL.Func([IDL.Vec(IDL.Principal)], [], []),
    sumTick: IDL.Func([], [Result_11], ["query"]),
    swap: IDL.Func([SwapArgs], [Result_9], []),
    transferPosition: IDL.Func([IDL.Principal, IDL.Principal, IDL.Nat], [Result_10], []),
    upgradeTokenStandard: IDL.Func([IDL.Principal], [Result], []),
    withdraw: IDL.Func([WithdrawArgs], [Result_9], []),
    withdrawMistransferBalance: IDL.Func([Token], [Result_9], []),
  });
};

export interface AccountBalance {
  balance0: bigint;
  balance1: bigint;
}
export interface ClaimArgs {
  positionId: bigint;
}
export interface CycleInfo {
  balance: bigint;
  available: bigint;
}
export interface DecreaseLiquidityArgs {
  liquidity: string;
  positionId: bigint;
}
export interface DepositAndMintArgs {
  tickUpper: bigint;
  fee0: bigint;
  fee1: bigint;
  amount0: bigint;
  amount1: bigint;
  positionOwner: Principal;
  amount0Desired: string;
  amount1Desired: string;
  tickLower: bigint;
}
export interface DepositArgs {
  fee: bigint;
  token: string;
  amount: bigint;
}
export type Error =
  | { CommonError: null }
  | { InternalError: string }
  | { UnsupportedToken: string }
  | { InsufficientFunds: null };
export interface GetPositionArgs {
  tickUpper: bigint;
  tickLower: bigint;
}
export interface IncreaseLiquidityArgs {
  positionId: bigint;
  amount0Desired: string;
  amount1Desired: string;
}
export interface MintArgs {
  fee: bigint;
  tickUpper: bigint;
  token0: string;
  token1: string;
  amount0Desired: string;
  amount1Desired: string;
  tickLower: bigint;
}
export interface Page {
  content: Array<UserPositionInfoWithId>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_1 {
  content: Array<UserPositionInfoWithTokenAmount>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_2 {
  content: Array<TickInfoWithId>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_3 {
  content: Array<TickLiquidityInfo>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_4 {
  content: Array<PositionInfoWithId>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface Page_5 {
  content: Array<[Principal, AccountBalance]>;
  offset: bigint;
  limit: bigint;
  totalElements: bigint;
}
export interface PoolMetadata {
  fee: bigint;
  key: string;
  sqrtPriceX96: bigint;
  tick: bigint;
  liquidity: bigint;
  token0: Token;
  token1: Token;
  maxLiquidityPerTick: bigint;
  nextPositionId: bigint;
}
export interface PositionInfo {
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
}
export interface PositionInfoWithId {
  id: string;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
}
export interface PushError {
  time: bigint;
  message: string;
}
export type Result = { ok: string } | { err: Error };
export type Result_10 = { ok: boolean } | { err: Error };
export type Result_11 = { ok: bigint } | { err: Error };
export type Result_12 =
  | {
      ok: { tokensOwed0: bigint; tokensOwed1: bigint };
    }
  | { err: Error };
export type Result_13 = { ok: PoolMetadata } | { err: Error };
export type Result_14 = { ok: Array<[bigint, WithdrawErrorLog]> } | { err: Error };
export type Result_15 =
  | {
      ok: { balance0: bigint; balance1: bigint };
    }
  | { err: Error };
export type Result_16 = { ok: Array<UserPositionInfoWithId> } | { err: Error };
export type Result_17 = { ok: Page } | { err: Error };
export type Result_18 = { ok: Page_1 } | { err: Error };
export type Result_19 = { ok: Array<bigint> } | { err: Error };
export type Result_20 = { ok: Array<[string, Array<bigint>]> } | { err: Error };
export type Result_21 = { ok: UserPositionInfo } | { err: Error };
export type Result_22 = { ok: Array<TransferLog> } | { err: Error };
export type Result_23 =
  | {
      ok: {
        swapFee0Repurchase: bigint;
        token0Amount: bigint;
        swapFeeReceiver: string;
        token1Amount: bigint;
        swapFee1Repurchase: bigint;
      };
    }
  | { err: Error };
export type Result_24 = { ok: Page_2 } | { err: Error };
export type Result_25 = { ok: Page_3 } | { err: Error };
export type Result_26 =
  | {
      ok: {
        infoCid: string;
        records: Array<SwapRecordInfo>;
        errors: Array<PushError>;
        retryCount: bigint;
      };
    }
  | { err: Error };
export type Result_27 = { ok: Page_4 } | { err: Error };
export type Result_28 = { ok: PositionInfo } | { err: Error };
export type Result_29 = { ok: { amount0: bigint; amount1: bigint } } | { err: Error };
export type Result_30 =
  | {
      ok: {
        tokenIncome: Array<[bigint, { tokensOwed0: bigint; tokensOwed1: bigint }]>;
        totalTokensOwed0: bigint;
        totalTokensOwed1: bigint;
      };
    }
  | { err: Error };
export type Result_31 = { ok: Page_5 } | { err: Error };
export type Result_8 = { ok: CycleInfo } | { err: Error };
export type Result_9 = { ok: bigint } | { err: Error };
export interface SwapArgs {
  amountIn: string;
  zeroForOne: boolean;
  amountOutMinimum: string;
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
  TVLToken0: bigint;
  TVLToken1: bigint;
  token0Fee: bigint;
  token1Fee: bigint;
  timestamp: bigint;
  token1ChangeAmount: bigint;
  token0Standard: string;
  price: bigint;
  poolId: string;
}
export interface TickInfoWithId {
  id: string;
  initialized: boolean;
  feeGrowthOutside1X128: bigint;
  secondsPerLiquidityOutsideX128: bigint;
  liquidityNet: bigint;
  secondsOutside: bigint;
  liquidityGross: bigint;
  feeGrowthOutside0X128: bigint;
  tickCumulativeOutside: bigint;
}
export interface TickLiquidityInfo {
  tickIndex: bigint;
  price0Decimal: bigint;
  liquidityNet: bigint;
  price0: bigint;
  price1: bigint;
  liquidityGross: bigint;
  price1Decimal: bigint;
}
export interface Token {
  address: string;
  standard: string;
}
export type TransactionType =
  | { decreaseLiquidity: null }
  | { claim: null }
  | { swap: null }
  | { addLiquidity: null }
  | { increaseLiquidity: null };
export interface TransferLog {
  to: Principal;
  fee: bigint;
  result: string;
  token: Token;
  action: string;
  daysFrom19700101: bigint;
  owner: Principal;
  from: Principal;
  fromSubaccount: [] | [Uint8Array | number[]];
  timestamp: bigint;
  index: bigint;
  amount: bigint;
  errorMsg: string;
}
export interface UserPositionInfo {
  tickUpper: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  tickLower: bigint;
}
export interface UserPositionInfoWithId {
  id: bigint;
  tickUpper: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  tickLower: bigint;
}
export interface UserPositionInfoWithTokenAmount {
  id: bigint;
  tickUpper: bigint;
  tokensOwed0: bigint;
  tokensOwed1: bigint;
  feeGrowthInside1LastX128: bigint;
  liquidity: bigint;
  feeGrowthInside0LastX128: bigint;
  token0Amount: bigint;
  token1Amount: bigint;
  tickLower: bigint;
}
export type Value = { Int: bigint } | { Nat: bigint } | { Blob: Uint8Array | number[] } | { Text: string };
export interface WithdrawArgs {
  fee: bigint;
  token: string;
  amount: bigint;
}
export interface WithdrawErrorLog {
  token: Token;
  time: bigint;
  user: Principal;
  amount: bigint;
}
export interface IICPSwapPoolActor {
  allTokenBalance: ActorMethod<[bigint, bigint], Result_31>;
  approvePosition: ActorMethod<[Principal, bigint], Result_10>;
  batchRefreshIncome: ActorMethod<[Array<bigint>], Result_30>;
  checkOwnerOfUserPosition: ActorMethod<[Principal, bigint], Result_10>;
  claim: ActorMethod<[ClaimArgs], Result_29>;
  decreaseLiquidity: ActorMethod<[DecreaseLiquidityArgs], Result_29>;
  deposit: ActorMethod<[DepositArgs], Result_9>;
  depositAllAndMint: ActorMethod<[DepositAndMintArgs], Result_9>;
  depositFrom: ActorMethod<[DepositArgs], Result_9>;
  getAdmins: ActorMethod<[], Array<Principal>>;
  getAvailabilityState: ActorMethod<[], { whiteList: Array<Principal>; available: boolean }>;
  getClaimLog: ActorMethod<[], Array<string>>;
  getCycleInfo: ActorMethod<[], Result_8>;
  getMistransferBalance: ActorMethod<[Token], Result_9>;
  getPosition: ActorMethod<[GetPositionArgs], Result_28>;
  getPositions: ActorMethod<[bigint, bigint], Result_27>;
  getSwapRecordState: ActorMethod<[], Result_26>;
  getTickInfos: ActorMethod<[bigint, bigint], Result_25>;
  getTicks: ActorMethod<[bigint, bigint], Result_24>;
  getTokenAmountState: ActorMethod<[], Result_23>;
  getTokenBalance: ActorMethod<[], { token0: bigint; token1: bigint }>;
  getTokenMeta: ActorMethod<[], { token0: Array<[string, Value]>; token1: Array<[string, Value]> }>;
  getTransferLogs: ActorMethod<[], Result_22>;
  getUserByPositionId: ActorMethod<[bigint], Result>;
  getUserPosition: ActorMethod<[bigint], Result_21>;
  getUserPositionIds: ActorMethod<[], Result_20>;
  getUserPositionIdsByPrincipal: ActorMethod<[Principal], Result_19>;
  getUserPositionWithTokenAmount: ActorMethod<[bigint, bigint], Result_18>;
  getUserPositions: ActorMethod<[bigint, bigint], Result_17>;
  getUserPositionsByPrincipal: ActorMethod<[Principal], Result_16>;
  getUserUnusedBalance: ActorMethod<[Principal], Result_15>;
  getVersion: ActorMethod<[], string>;
  getWithdrawErrorLog: ActorMethod<[], Result_14>;
  increaseLiquidity: ActorMethod<[IncreaseLiquidityArgs], Result_9>;
  init: ActorMethod<[bigint, bigint, bigint], undefined>;
  metadata: ActorMethod<[], Result_13>;
  mint: ActorMethod<[MintArgs], Result_9>;
  quote: ActorMethod<[SwapArgs], Result_9>;
  quoteForAll: ActorMethod<[SwapArgs], Result_9>;
  refreshIncome: ActorMethod<[bigint], Result_12>;
  removeErrorTransferLog: ActorMethod<[bigint, boolean], undefined>;
  removeWithdrawErrorLog: ActorMethod<[bigint, boolean], undefined>;
  resetTokenAmountState: ActorMethod<[bigint, bigint, bigint, bigint], undefined>;
  setAdmins: ActorMethod<[Array<Principal>], undefined>;
  setAvailable: ActorMethod<[boolean], undefined>;
  setWhiteList: ActorMethod<[Array<Principal>], undefined>;
  sumTick: ActorMethod<[], Result_11>;
  swap: ActorMethod<[SwapArgs], Result_9>;
  transferPosition: ActorMethod<[Principal, Principal, bigint], Result_10>;
  upgradeTokenStandard: ActorMethod<[Principal], Result>;
  withdraw: ActorMethod<[WithdrawArgs], Result_9>;
  withdrawMistransferBalance: ActorMethod<[Token], Result_9>;
}

export async function newICPSwapPoolActor(canisterId: Principal): Promise<IICPSwapPoolActor> {
  return Actor.createActor(idlFactory, {
    canisterId,
    agent: await getMyAgent(),
  });
}
