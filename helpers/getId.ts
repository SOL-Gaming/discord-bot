import { response } from "express";
import fetch from "node-fetch";
import { getWalletNfts } from "./getWalletNfts";
const {db_uri} = require("../config.json");
const mongoose = require("mongoose");
const User = require("../handler/user.js");

export async function getId(userId) {
    await mongoose.connect(db_uri);
    const res = await User.findOne({user_id: userId})
    const nfts = await getWalletNfts(res.wallet_address);
    
    for(const nft of nfts) {
        if(nft.mint === "ENPbnxfMfmmS2cBV5NxTYzp9W6SadhsbsCks16h235v") {
            const uri = nft.data.uri;

            return uri.split("/")[4];

        }
    }
}
