const getWalletNfts = require('../helpers/getWalletNfts');
const mongoose = require("mongoose");
const {db_uri} = require("../config.json");
const User = require("../handler/user.js");
const { MongoClient } = require("mongodb");

export async function getWallet(userid) {
    const client = new MongoClient(db_uri);
    await client.connect();
    const database = client.db('myFirstDatabase');
    const users = database.collection('users');
    const query = { user_id: userid};
    const res = await users.findOne(query);
    try {
        const wallet = res.wallet_address;
        return wallet;
    }
    catch(e) {
        console.log(e, res);
        return false;
    }
}
