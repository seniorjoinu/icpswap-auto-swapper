import { Principal } from "npm:@dfinity/principal";
import { Account, newICRC1Actor } from "../utils/canisters/icrc1.ts";
import { opt } from "../utils/index.ts";
import { getMyIdentity, getMySubaccount } from "../utils/identity.ts";

export async function getBalance(tokenCanId: Principal, owner: Principal, subaccount?: Uint8Array): Promise<bigint> {
  const token = await newICRC1Actor(tokenCanId);

  return token.icrc1_balance_of({ owner, subaccount: opt(subaccount) });
}

export const BURN_CAN_ID = Principal.fromText("egjwt-lqaaa-aaaak-qi2aa-cai");
export const ICP_CAN_ID = Principal.fromText("ryjl3-tyaaa-aaaaa-aaaba-cai");
export const STD_FEE = 10_000n;

export async function getMyBalance(tokenCanId: Principal): Promise<bigint> {
  const id = await getMyIdentity();

  return getBalance(tokenCanId, id.getPrincipal());
}

export async function getMyPoolBalance(tokenCanId: Principal, poolCanId: Principal): Promise<bigint> {
  const subaccount = await getMySubaccount();

  return getBalance(tokenCanId, poolCanId, subaccount);
}

export async function transfer(tokenCanId: Principal, qty: bigint, to: Account): Promise<bigint> {
  const token = await newICRC1Actor(tokenCanId);

  const resp = await token.icrc1_transfer({
    amount: qty,
    to,
    from_subaccount: [],
    fee: [],
    created_at_time: [],
    memo: [],
  });

  if ("Err" in resp) {
    console.error(resp.Err);

    throw new Error();
  }

  return resp.Ok;
}

export async function transferToPool(tokenCanId: Principal, qty: bigint, poolCanId: Principal): Promise<bigint> {
  const sub = await getMySubaccount();

  return transfer(tokenCanId, qty, { owner: poolCanId, subaccount: opt(sub) });
}
