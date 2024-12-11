This bot performs token swaps via the ICP/BURN pair on ICPSwap.

### Run

* Install Deno v2
* run `deno --allow-all main.ts`
* copy the printed principal and transfer some BURN or ICP to it
* enjoy, the bot will make automatic swaps every 1-2 minutes

(during the first run, the bot will generate a keypair for itself and put it into the `data` folder - do not copy this keypair anywhere and do not store large amounts of money on it)