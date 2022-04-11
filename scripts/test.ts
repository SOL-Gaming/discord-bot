import { PublicKey } from '@solana/web3.js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";
import { getWallet } from '../helpers/getWallet';
import { getWalletNfts } from '../helpers/getWalletNfts';
import { hasNft } from '../helpers/hasNft';

async function run() {
    const wallet = "4X4mk7ZHHsBmJcsvqQhVLA5hHoRAsArf33GTxjN3KCYj"
    const nfts = await getWalletNfts(wallet);
    console.log(`Wallet: ${wallet}, NFTs: ${nfts}`)
    for(let nft of nfts.value) {
        try {
            if(await hasNft(nft.account.data.parsed.info.mint)) {
                console.log(`The user owns an NFT.`);
            }
        } catch {}
    }

    console.log("The user has no NFT.");
}

run();