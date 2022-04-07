import {Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";

import fetch from "node-fetch";

async function getTokenSender(wallet_address) {
    const connection = new Connection(clusterApiUrl('mainnet-beta'));
    const res =  await connection.getParsedTokenAccountsByOwner(new PublicKey(wallet_address), {programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")}, "confirmed");

    for(let nft of res.value) {
        let uri = `https://public-api.solscan.io/account/transactions?account=${nft.pubkey.toString()}&limit=1`

        await fetch(uri, {method: "GET", headers: {"accept": "application/json", "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:99.0) Gecko/20100101 Firefox/99.0"}})
            .then(response => response.json())
            .then(response => {
                console.log(`TOKEN: ${nft.pubkey.toString()} | SENDER: ${response[0].signer[0]}`);
            })
    }



}

getTokenSender("hippoi8ksKEVAdEYLYgmEJ18VxuBnY3bv8eNuMMXj5q");