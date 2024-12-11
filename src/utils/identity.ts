import { Ed25519KeyIdentity } from "npm:@dfinity/identity";
import { ensureFile } from "@std/fs";
import { join } from "@std/path";
import { Agent, HttpAgent } from "npm:@dfinity/agent";

const KEYPAIR_PATH = join(".", "data", "keypair.json");

let IDENTITY: Ed25519KeyIdentity | undefined = undefined;

export async function getMyIdentity(): Promise<Ed25519KeyIdentity> {
  // if has in cache - return
  if (IDENTITY) return IDENTITY;

  // if don't - try to get from the file
  await ensureFile(KEYPAIR_PATH);

  const decoder = new TextDecoder("utf-8");
  const data = await Deno.readFile(KEYPAIR_PATH);

  // if there is an identity from the file - return cache and return
  if (data.length != 0) {
    const keypairJson = decoder.decode(data);
    IDENTITY = Ed25519KeyIdentity.fromJSON(keypairJson);

    return IDENTITY;
  }

  // otherwise, generate a new identity, cache it, save to file and return
  const id = Ed25519KeyIdentity.generate();
  IDENTITY = id;

  const encoder = new TextEncoder();
  await Deno.writeFile(KEYPAIR_PATH, encoder.encode(JSON.stringify(id.toJSON())));

  return IDENTITY;
}

let AGENT: Agent | undefined = undefined;

export async function getMyAgent(): Promise<Agent> {
  if (AGENT) return AGENT;

  const agent = await HttpAgent.create({
    identity: await getMyIdentity(),
  });

  AGENT = agent;

  return agent;
}

export async function getMySubaccount(): Promise<Uint8Array> {
  const id = await getMyIdentity();
  const pidArr = id.getPrincipal().toUint8Array();

  const size = pidArr.length;

  return new Uint8Array([size, ...pidArr, ...Array(32 - (size + 1)).fill(0)]);
}
