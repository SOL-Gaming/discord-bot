import {Connection, clusterApiUrl, PublicKey} from "@solana/web3.js";
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";

export async function getWalletNfts(wallet_address) {
    const connection = new Connection(clusterApiUrl('devnet'));
    return await connection.getParsedTokenAccountsByOwner(new PublicKey(wallet_address), {programId: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")}, "confirmed");

}
