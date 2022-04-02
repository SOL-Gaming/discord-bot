import {getWalletNfts} from '../helpers/getWalletNfts';
import {Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";
const mongoose = require("mongoose");
const {db_uri} = require("../config.json");
const User = require("../handler/user.js");
const { MongoClient } = require("mongodb");


import whilelist from "../handler/whitelist.json";


const connection = new Connection(clusterApiUrl('devnet'));

export async function hasNft(userid) {
    const client = new MongoClient(db_uri);
    await client.connect();

    const database = client.db('myFirstDatabase');
    const users = database.collection('users');
    const query = { user_id: userid };
    const res = await users.findOne(query);
    const nfts = await getWalletNfts(res.wallet_address);
    console.log(nfts);


    for(let nft of nfts.value) {
        const query_mint = nft.account.data.parsed.info.mint;
        return !!whilelist.includes(query_mint.toString());
    }
}
