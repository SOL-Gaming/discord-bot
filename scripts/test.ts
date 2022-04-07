import { PublicKey } from '@solana/web3.js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import {Metadata} from "@metaplex-foundation/mpl-token-metadata";
import { getWallet } from '../helpers/getWallet';

export async function hasNft(mint) {
    let metadataProgramIdKey = new PublicKey( "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" );

    let [address, nonce] = await PublicKey.findProgramAddress( [ Buffer.from("metadata", "utf8"), metadataProgramIdKey.toBuffer(), new PublicKey(mint).toBuffer(), ], metadataProgramIdKey );

    const connection = new Connection(clusterApiUrl('devnet'));

    const meta_oc = await Metadata.fromAccountAddress(connection,address)

    
    try {
        if(meta_oc.collection?.key.toString() === "Df5ZwzMPAFSatLjZTXTozRyVPHbYtHLuuf7ZnfbsoigS") {
            return true;
        } else {
            return false;
        }
    } catch {
        return false;
    }  
}