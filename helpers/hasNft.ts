const getWalletNfts = require('../helpers/getWalletNfts');
const mongoose = require("mongoose");
const {db_uri} = require("../config.json");
const User = require("../handler/user.js");
const { MongoClient } = require("mongodb");

export async function hasNft(userid) {
    console.log("II " + userid);
    /*await mongoose.connect("mongodb+srv://root:oAkKpb3pFNIQ37Ct@discord.lowiw.mongodb.net/myFirstDatabase?retryWrites=true&w=majority");
    const res = await User.findOne({user_id: userid.toString()})
    console.log(res);*/
    const client = new MongoClient(db_uri);
    await client.connect();

    const database = client.db('myFirstDatabase');
    const users = database.collection('users');
    // Query for a movie that has the title 'Back to the Future'
    const query = { user_id: userid.toString() };
    const res = await users.findOne(query);/*
    console.log(res);
    try {
        const wallet = res.wallet_address;
        const nfts = await getWalletNfts.getWalletNfts(wallet)

        for(const nft of nfts) {
            if(nft.mint === "ENPbnxfMfmmS2cBV5NxTYzp9W6SadhsbsCks16h235v") {
                return true;
            } else {
                return false;
            }
        }
        
    } catch (e) {
        return false;
    }
    
    */
    return true;
}

exports.hasNft = hasNft;