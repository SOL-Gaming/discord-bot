import { response } from "express";
import fetch from "node-fetch";
import { getWalletNfts } from "./getWalletNfts";

export async function getLosses(wallet) {
    const nfts = await getWalletNfts(wallet);

    for(const nft of nfts) {
        if(nft.mint === "ENPbnxfMfmmS2cBV5NxTYzp9W6SadhsbsCks16h235v") {
            const uri = nft.data.uri;

            const response = await fetch(uri);
            const data = await response.json();
            
            return data.attributes[1].value;
        }
    }
}
