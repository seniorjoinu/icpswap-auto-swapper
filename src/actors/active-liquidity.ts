import { Principal } from "npm:@dfinity/principal";
import { DEFAULT_POOL_FEE, DEFAULT_TICK_SPACING, listPools } from "../service/pools.ts";
import { delay, panic } from "../utils/index.ts";
import {
  IICPSwapPoolActor,
  newICPSwapPoolActor,
  PoolMetadata,
  UserPositionInfoWithId,
} from "../utils/canisters/icpswap-pool.ts";
import { getMyIdentity } from "../utils/identity.ts";
import {
  calcMode,
  calcTickBoundaries,
  ITickBoundaries,
  positionIsInPlace,
  TBoundaryMode,
  TPoolBalances,
} from "../utils/ticks.ts";
import { STD_FEE } from "../service/tokens.ts";
import { newICPSwapCalcActor } from "../utils/canisters/icpswap-calc.ts";
import { approxAmount0, approxAmount1, Q96 } from "../utils/math.ts";
import { toHexString } from "npm:@dfinity/candid";

const META_LOOP_INTERVAL_MS = 2000;
const MAIN_LOOP_INTERVAL_MS = 2000;

export class ActiveLiquidityActor {
  protected isRunning: boolean = false;
  private positionModes: Partial<Record<string, TBoundaryMode>> = {};

  constructor(
    public readonly token0: Principal,
    public readonly token1: Principal,
    public readonly poolId: Principal,
    private token0UnusedBalance: bigint,
    private token1UnusedBalance: bigint,
    private positions: UserPositionInfoWithId[],
    private poolMeta: PoolMetadata
  ) {}

  public start() {
    this.isRunning = true;
    this.mainLoop();
    this.refreshMetaLoop();
  }

  public async stop() {
    this.isRunning = false;

    await Promise.all([this.mainLoopPromise, this.refreshMetaLoopPromise]);
  }

  protected mainLoop() {
    this.mainLoopPromise = this._mainLoop();
  }

  private mainLoopPromise: Promise<void> | undefined = undefined;
  private async _mainLoop() {
    while (this.isRunning) {
      if (!Object.values(this.positionModes).includes("both")) {
        await this.rebalance();
      }

      if (this.canCreatePosition()) {
        await this.createPositions();
      }

      const anyNotInPlace = this.positions.some((pos) => {
        const boundaries: ITickBoundaries = { lower: pos.tickLower, upper: pos.tickUpper };
        const targetTick = this.poolMeta.tick;
        const mode = this.positionModes[pos.id.toString()];
        if (!mode) panic("Unreacheable! Mode not found for position #", pos.id);

        const isInPlace = positionIsInPlace(boundaries, targetTick, mode, DEFAULT_TICK_SPACING);

        return !isInPlace;
      });

      if (anyNotInPlace) {
        console.log("Price moved, destroying positions...");

        await Promise.all(
          this.positions.map((pos) => {
            return this.destroyPosition(pos);
          })
        );

        this.updatePositionList();
      }

      await delay(MAIN_LOOP_INTERVAL_MS);
    }
  }

  private async destroyPosition(position: UserPositionInfoWithId, pool?: IICPSwapPoolActor) {
    if (!pool) {
      pool = await newICPSwapPoolActor(this.poolId);
    }

    console.log(`Destroying position #${position.id}...`);

    const res1 = await pool.claim({ positionId: position.id });
    if ("err" in res1) panic("Unable to claim fees of position #", position.id, ":", res1.err);

    this.token0UnusedBalance += res1.ok.amount0;
    this.token1UnusedBalance += res1.ok.amount1;

    console.log(`Position #${position.id} - claimed fees: token0 - ${res1.ok.amount0}, token1 - ${res1.ok.amount1}`);

    const res2 = await pool.decreaseLiquidity({ positionId: position.id, liquidity: position.liquidity.toString() });
    if ("err" in res2) panic("Unable to decrease liquidity of position #", position.id, ":", res2.err);

    this.token0UnusedBalance += res2.ok.amount0;
    this.token1UnusedBalance += res2.ok.amount1;

    delete this.positionModes[position.id.toString()];

    console.log(
      `Position #${position.id} destroyed, total funds: token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}`
    );
  }

  public getFlooredBalances(): TPoolBalances {
    return {
      token0: this.token0UnusedBalance > STD_FEE ? this.token0UnusedBalance : 0n,
      token1: this.token1UnusedBalance > STD_FEE ? this.token1UnusedBalance : 0n,
    };
  }

  private canCreatePosition(): boolean {
    const b = this.getFlooredBalances();

    return b.token0 + b.token1 > 0n;
  }

  private async rebalance(pool?: IICPSwapPoolActor) {
    if (!pool) {
      pool = await newICPSwapPoolActor(this.poolId);
    }

    console.log(
      `Rebalancing funds... Before: token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}`
    );

    const token0AsToken1 = approxAmount1(this.token0UnusedBalance, this.poolMeta.sqrtPriceX96);
    const token1AvgSum = (this.token1UnusedBalance + token0AsToken1) / 2n;

    if (this.token1UnusedBalance > token1AvgSum) {
      const token1ToSell = this.token1UnusedBalance - token1AvgSum;

      if (token1ToSell > STD_FEE) {
        const token0ToBuy = (approxAmount0(token1ToSell, this.poolMeta.sqrtPriceX96) * 992n) / 1000n;

        console.log(`Target token1 balance ${token1AvgSum}; selling ${token1ToSell} token1 for ${token0ToBuy} token0`);

        const swapRes = await pool.swap({
          amountIn: token1ToSell.toString(),
          amountOutMinimum: token0ToBuy.toString(),
          zeroForOne: false,
        });
        if ("err" in swapRes) panic(`Unable to swap`, swapRes.err);

        this.token1UnusedBalance -= token1ToSell;
        this.token0UnusedBalance += swapRes.ok;
      }
    } else if (this.token1UnusedBalance < token1AvgSum) {
      const token1ToBuy = token1AvgSum - this.token1UnusedBalance;

      if (token1ToBuy > STD_FEE) {
        const token0ToSell = (approxAmount0(token1ToBuy, this.poolMeta.sqrtPriceX96) * 1008n) / 1000n;

        console.log(`Target token1 balance ${token1AvgSum}; selling ${token0ToSell} token0 for ${token1ToBuy} token1`);

        const swapRes = await pool.swap({
          amountIn: token0ToSell.toString(),
          amountOutMinimum: token1ToBuy.toString(),
          zeroForOne: true,
        });
        if ("err" in swapRes) panic(`Unable to swap`, swapRes.err);

        this.token0UnusedBalance -= token0ToSell;
        this.token1UnusedBalance += swapRes.ok;
      }
    }

    console.log(
      `Rebalancing complete! After: token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}`
    );
  }

  private async createPositions(pool?: IICPSwapPoolActor) {
    if (!pool) {
      pool = await newICPSwapPoolActor(this.poolId);
    }

    console.log(
      `Minting positions, total funds: token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}`
    );

    while (this.isRunning) {
      const balances = this.getFlooredBalances();
      if (balances.token0 + balances.token1 === 0n) break;

      const mode = calcMode(balances);
      const boundaries = calcTickBoundaries(this.poolMeta.tick, DEFAULT_TICK_SPACING, mode);

      const id = await this.mintPosition(balances, boundaries, pool);
      this.positionModes[id.toString()] = mode;

      await this.updateUnusedBalances(pool);

      console.log(
        `Minted [${mode}] position #${id} with boundaries [${boundaries.lower}, ${boundaries.upper}], leftovers: token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}`
      );
    }

    await this.updatePositionList();
  }

  private async updatePositionList(pool?: IICPSwapPoolActor) {
    if (!pool) {
      pool = await newICPSwapPoolActor(this.poolId);
    }

    const me = await getMyIdentity();

    const resp = await pool.getUserPositionsByPrincipal(me.getPrincipal());
    if ("err" in resp) panic("Unable to fetch user positions", resp.err);

    this.positions = resp.ok.filter((it) => it.liquidity > 0n);
  }

  private async mintPosition(balances: TPoolBalances, boundaries: ITickBoundaries, pool?: IICPSwapPoolActor) {
    if (!pool) {
      pool = await newICPSwapPoolActor(this.poolId);
    }

    const resp = await pool.mint({
      token0: this.token0.toText(),
      token1: this.token1.toText(),
      amount0Desired: balances.token0.toString(),
      amount1Desired: balances.token1.toString(),
      tickLower: boundaries.lower,
      tickUpper: boundaries.upper,
      fee: DEFAULT_POOL_FEE,
    });
    if ("err" in resp) panic("Unable to mint a position:", resp.err);

    return resp.ok;
  }

  private async updateUnusedBalances(pool?: IICPSwapPoolActor) {
    if (!pool) {
      pool = await newICPSwapPoolActor(this.poolId);
    }

    const me = await getMyIdentity();

    const resp = await pool.getUserUnusedBalance(me.getPrincipal());
    if ("err" in resp) panic("Unable to get unused balances", resp.err);

    this.token0UnusedBalance = resp.ok.balance0;
    this.token1UnusedBalance = resp.ok.balance1;
  }

  protected refreshMetaLoop() {
    this.refreshMetaLoopPromise = this._refreshMetaLoop();
  }

  private refreshMetaLoopPromise: Promise<void> | undefined = undefined;
  private async _refreshMetaLoop() {
    while (this.isRunning) {
      const pool = await newICPSwapPoolActor(this.poolId);
      const meta = await pool.metadata();

      if ("ok" in meta) {
        this.poolMeta = meta.ok;
      } else {
        console.error("Meta fetching failed:", meta.err);
      }

      await delay(META_LOOP_INTERVAL_MS);
    }
  }

  public static async create(tokenA: Principal, tokenB: Principal): Promise<ActiveLiquidityActor> {
    const poolList = await listPools();

    const tokenAStr = tokenA.toText();
    const tokenBStr = tokenB.toText();

    const poolInfo = poolList.find(
      (it) =>
        (it.token0Id === tokenAStr && it.token1Id === tokenBStr) ||
        (it.token0Id === tokenBStr && it.token1Id === tokenAStr)
    );

    if (!poolInfo) panic("No pool found for tokens:", tokenAStr, ",", tokenBStr);

    const me = await getMyIdentity();

    const token0 = Principal.fromText(poolInfo.token0Id);
    const token1 = Principal.fromText(poolInfo.token1Id);
    const poolId = Principal.fromText(poolInfo.pool);

    const pool = await newICPSwapPoolActor(poolId);
    const res1 = await pool.getUserUnusedBalance(me.getPrincipal());
    if ("err" in res1) panic("Unable to get unused balances", res1.err);

    const { balance0: token0UnusedBalance, balance1: token1UnusedBalance } = res1.ok;

    const res2 = await pool.getUserPositionsByPrincipal(me.getPrincipal());
    if ("err" in res2) panic("Unable to get user positions", res2.err);

    const positions = res2.ok.filter((it) => it.liquidity > 0n);

    const meta = await pool.metadata();
    if ("err" in meta) panic("Unable to fetch pool metadata", meta.err);

    const actor = new ActiveLiquidityActor(
      token0,
      token1,
      poolId,
      token0UnusedBalance,
      token1UnusedBalance,
      positions,
      meta.ok
    );

    console.log("Actor created");

    for (let p of actor.positions) {
      await actor.destroyPosition(p, pool);
    }

    actor.positions = [];
    console.log("Actor is ready");

    return actor;
  }
}
