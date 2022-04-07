import { PublicKey } from '@solana/web3.js';
import {getTokenAccount} from './getTokenAccount';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { createMint, getOrCreateAssociatedTokenAccount, mintTo, transfer } from '@solana/spl-token';

import {getWallet } from './getWallet';

export async function airdrop(wallet, amount) {
        const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

        const senderKeypair = Keypair.fromSecretKey(new Uint8Array([154,33,103,44,204,223,145,46,200,173,153,1,129,31,156,130,75,238,185,106,50,79,195,163,102,33,191,155,119,188,251,121,218,119,98,175,66,110,192,231,136,35,70,226,73,240,222,120,65,89,193,46,82,39,212,71,215,30,206,91,72,75,103,225]));
        const mint = new PublicKey("G5YfTWGFuFJiEddvaqpxSuMxFv16x9PeNYtVUH8FadNK");
        const senderTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeypair,
            mint,
            senderKeypair.publicKey
        );
        
        const recieverTokenAccount = await getOrCreateAssociatedTokenAccount(
            connection,
            senderKeypair,
            mint,
            new PublicKey(wallet)
        );
        console.log(`sender token account: ${senderTokenAccount.address.toString()}`);
        console.log(`token account: ${recieverTokenAccount.address.toString()}`);

        const signature = await transfer(
            connection,
            senderKeypair,
            senderTokenAccount.address,
            recieverTokenAccount.address,
            senderKeypair.publicKey,
            amount);

        console.log(`transferred 1 token to ${recieverTokenAccount.address.toString()} from ${senderTokenAccount.address.toString()}`);
        console.log(`signature: ${signature}`);

        return signature;
    
}