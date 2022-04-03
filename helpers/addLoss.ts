const editJson = require("../doggos-backend/helpers/editJson.js")
import {getJson} from "./getJson";
import {getId} from "./getId";

export async function addLoss(userid) {

    const fileId = await getId(userid);
    console.log(fileId);
    const json = await getJson(fileId);
    let losses = json.attributes[1].value;
    losses ++;

    const r = await editJson("losses", losses, fileId);

    return r;
}
