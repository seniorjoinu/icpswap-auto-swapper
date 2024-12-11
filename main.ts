import { BURN_CAN_ID, ICP_CAN_ID } from "./src/service/tokens.ts";
import { AutoSwapActor } from "./src/actors/auto-swap-actor.ts";

console.log("Press Ctrl-C to close");

const actor = await AutoSwapActor.create(BURN_CAN_ID, ICP_CAN_ID);

actor.start();

Deno.addSignalListener("SIGINT", () => {
  console.log("Finishing...");

  actor.stop().then(() => {
    Deno.exit();
  });
});
