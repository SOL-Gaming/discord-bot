
import { getLosses } from "./getLosses";
import { getId } from "./getId";
const {db_uri} = require("../config.json");
const mongoose = require("mongoose");
const User = require("../handler/user.js");
import fetch from "node-fetch";

const editJson = require("../doggos-backend/helpers/editJson.js")
const getJson = require("../doggos-backend/helpers/getJson.js")

export async function addLoss(userid) {

    const fileId = await getId(userid);
    await mongoose.connect(db_uri);
    const res = await User.findOne({user_id: userid})
    let json = await getJson(fileId);
    let losses = json.attributes[1].value;
    losses ++;
    const r = await editJson("losses", losses, fileId);
}
