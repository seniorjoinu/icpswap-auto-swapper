import { Principal } from "npm:@dfinity/principal";
import { newICPSwapPoolActor, PoolMetadata } from "../utils/canisters/icpswap-pool.ts";
import { listPools } from "../service/pools.ts";
import { delay, panic } from "../utils/index.ts";
import { getMyIdentity, getMySubaccount } from "../utils/identity.ts";
import { STD_FEE } from "../service/tokens.ts";
import { approxAmount0, approxAmount1 } from "../utils/math.ts";
import { newICRC1Actor } from "../utils/canisters/icrc1.ts";

const MAIN_LOOP_MIN_INTERVAL_MS = 1000 * 60 * 1;
const MAIN_LOOP_INTERVAL_DIVERGENCE_MS = 1000 * 60 * 1;
const TICK_DURATION_MS = 1000;

export class AutoSwapActor {
  protected isRunning: boolean = false;

  constructor(
    public readonly token0: Principal,
    public readonly token1: Principal,
    public readonly poolId: Principal,
    private token0UnusedBalance: bigint,
    private token1UnusedBalance: bigint,
    private poolMeta: PoolMetadata
  ) {}

  public static async create(tokenA: Principal, tokenB: Principal): Promise<AutoSwapActor> {
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

    const meta = await pool.metadata();
    if ("err" in meta) panic("Unable to fetch pool metadata", meta.err);

    const actor = new AutoSwapActor(token0, token1, poolId, token0UnusedBalance, token1UnusedBalance, meta.ok);

    console.log(
      `Auto Swap Actor is ready [token0 - ${actor.token0UnusedBalance}, token1 - ${actor.token1UnusedBalance}]`
    );

    return actor;
  }

  public start() {
    this.isRunning = true;
    this.mainLoop();
  }

  public async stop() {
    this.isRunning = false;

    await Promise.all([this.mainLoopPromise]);
  }

  protected mainLoop() {
    this.mainLoopPromise = this._mainLoop();
  }

  private mainLoopPromise: Promise<void> | undefined = undefined;
  private async _mainLoop() {
    while (this.isRunning) {
      console.log("");
      console.log("--- New Round ---");
      console.log((await getMyIdentity()).getPrincipal().toText());
      console.log("");

      console.log("Looking for additional liquidity...");
      await this.depositAll();
      console.log("Done.");

      console.log("Updating unused balances...");
      await this.updateUnusedBalances();
      console.log("Done.");

      console.log("Updating pool metadata...");
      await this.updateMeta();
      console.log("Done.");

      console.log("Swapping tokens...");
      await this.swap();
      console.log("Done.");

      const delayMs = MAIN_LOOP_MIN_INTERVAL_MS + Math.floor(Math.random() * MAIN_LOOP_INTERVAL_DIVERGENCE_MS);
      console.log(`Waiting for ${(delayMs / 1000 / 60).toFixed(1)} minutes before continuing...`);

      const ticks = Math.floor(delayMs / TICK_DURATION_MS);

      for (let i = 0; i < ticks; i++) {
        if (!this.isRunning) return;

        await delay(TICK_DURATION_MS);
      }
    }
  }

  private async depositAll() {
    const pid = (await getMyIdentity()).getPrincipal();
    const subaccount = await getMySubaccount();
    const pool = await newICPSwapPoolActor(this.poolId);

    const token0 = await newICRC1Actor(this.token0);
    const balance0 = await token0.icrc1_balance_of({ owner: pid, subaccount: [] });
    if (balance0 > STD_FEE * 2n) {
      console.log(
        `New token0 found: ${balance0}, depositing... [token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}]`
      );

      const res = await token0.icrc1_transfer({
        from_subaccount: [],
        to: { owner: this.poolId, subaccount: [subaccount] },
        amount: balance0 - STD_FEE,
        created_at_time: [],
        fee: [],
        memo: [],
      });

      if ("Err" in res) {
        console.error("Unable to transfer token0", res.Err);
      } else {
        const res1 = await pool.deposit({ token: this.token0.toText(), amount: balance0 - STD_FEE, fee: STD_FEE });
        if ("err" in res1) {
          console.error("Unable to deposit token0", res1.err);
        } else {
          this.token0UnusedBalance += res1.ok;
          console.log(
            `Successfully deposited token0! [token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}]`
          );
        }
      }
    }

    const token1 = await newICRC1Actor(this.token1);
    const balance1 = await token1.icrc1_balance_of({ owner: pid, subaccount: [] });
    if (balance1 > STD_FEE * 2n) {
      console.log(
        `New token1 found: ${balance1}, depositing... [token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}]`
      );

      const res = await token1.icrc1_transfer({
        from_subaccount: [],
        to: { owner: this.poolId, subaccount: [subaccount] },
        amount: balance1 - STD_FEE,
        created_at_time: [],
        fee: [],
        memo: [],
      });

      if ("Err" in res) {
        console.error("Unable to transfer token1", res.Err);
      } else {
        const res1 = await pool.deposit({ token: this.token1.toText(), amount: balance1 - STD_FEE, fee: STD_FEE });
        if ("err" in res1) {
          console.error("Unable to deposit token1", res1.err);
        } else {
          this.token1UnusedBalance += res1.ok;
          console.log(
            `Successfully deposited token1! [token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}]`
          );
        }
      }
    }
  }

  private async swap() {
    const pool = await newICPSwapPoolActor(this.poolId);

    if (this.token0UnusedBalance > STD_FEE) {
      const minAmount1 = (approxAmount1(this.token0UnusedBalance, this.poolMeta.sqrtPriceX96) * 95n) / 100n;
      const res = await pool.swap({
        amountIn: this.token0UnusedBalance.toString(),
        amountOutMinimum: minAmount1.toString(),
        zeroForOne: true,
      });

      if ("err" in res) {
        console.error("Unable to swap 0->1", res.err);
      } else {
        this.token0UnusedBalance = 0n;
        this.token1UnusedBalance += res.ok;

        console.log(`Swap (0->1) done! [token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}]`);
      }
    } else if (this.token1UnusedBalance > STD_FEE) {
      const minAmount0 = (approxAmount0(this.token1UnusedBalance, this.poolMeta.sqrtPriceX96) * 95n) / 100n;
      const res = await pool.swap({
        amountIn: this.token1UnusedBalance.toString(),
        amountOutMinimum: minAmount0.toString(),
        zeroForOne: false,
      });

      if ("err" in res) {
        console.error("Unable to swap 1->0", res.err);
      } else {
        this.token0UnusedBalance += res.ok;
        this.token1UnusedBalance = 0n;

        console.log(`Swap (1->0) done! [token0 - ${this.token0UnusedBalance}, token1 - ${this.token1UnusedBalance}]`);
      }
    } else {
      console.log("Nothing to swap :(");
    }
  }

  private async updateUnusedBalances() {
    const pool = await newICPSwapPoolActor(this.poolId);

    const me = await getMyIdentity();

    const resp = await pool.getUserUnusedBalance(me.getPrincipal());
    if ("err" in resp) panic("Unable to get unused balances", resp.err);

    this.token0UnusedBalance = resp.ok.balance0;
    this.token1UnusedBalance = resp.ok.balance1;
  }

  private async updateMeta() {
    const pool = await newICPSwapPoolActor(this.poolId);
    const meta = await pool.metadata();

    if ("ok" in meta) {
      this.poolMeta = meta.ok;
    } else {
      panic("Meta fetching failed:", meta.err);
    }
  }
}
