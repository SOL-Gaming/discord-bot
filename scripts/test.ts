import {getWalletNfts} from "../helpers/getWalletNfts";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";
import {hasNft} from "../helpers/hasNft";

const connection = new Connection(clusterApiUrl('devnet'));

async function run() {
    const r = await hasNft("97748027954974720");

    console.log(r);

}

run();