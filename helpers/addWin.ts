const editJson = require("../doggos-backend/helpers/editJson.js")
import {getJson} from "./getJson";
import {getId} from "./getId";

export async function addWin(userid) {

    const fileId = await getId(userid);
    const json = await getJson(fileId);
    let wins = json.attributes[0].value;
    wins ++;

    const r = await editJson("wins", wins, fileId);

    return r;
}
