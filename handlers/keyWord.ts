import { getId } from "../helpers/getId";
import { getJson } from "../helpers/getJson"

export async function keyWordHandler(sender, content) {
    const fileId = await getId(sender.id);
    console.log(await getJson(fileId));
    
}