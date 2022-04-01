import {getWallet} from "../helpers/getWallet";

async function run() {
    const my_wallet = await getWallet("924694666350309416");
    const pekka_wallet = await getWallet("247363369168797697");

    console.log(`My wallet: ${JSON.stringify(my_wallet)}`);
    console.log(`Pekka's wallet: ${JSON.stringify(pekka_wallet)}`);
}

run();