import { response } from "express";
import fetch from "node-fetch";
import { getWalletNfts } from "./getWalletNfts";
const {db_uri} = require("../config.json");
const mongoose = require("mongoose");
const User = require("../handler/user.js");
import {getWallet} from "./getWallet";

import whitelist from "../handler/whitelist.json";
import {clusterApiUrl, Connection, PublicKey} from "@solana/web3.js";

export async function getId(userId) {

    const wallet_address = await getWallet(userId);
    const nfts = await getWalletNfts(wallet_address);

    let metadataProgramIdKey = new PublicKey( "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" );

    let [address, nonce] = await PublicKey.findProgramAddress( [ Buffer.from("metadata", "utf8"), metadataProgramIdKey.toBuffer(), new PublicKey("AXUMpLK9X59aqZkBne5mHDsxxirK28MCQrvtvEEYVQt1").toBuffer(), ], metadataProgramIdKey );

    const connection = new Connection(clusterApiUrl('devnet'));

    const metdat = await connection.getAccountInfo( address);

    if(metdat != null){
        const cleanmetadata = new TextDecoder().decode( metdat.data.slice(119, 182) );
        return cleanmetadata.split("/")[4]
    }
}
