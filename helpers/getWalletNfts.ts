const web3 = require('@solana/web3.js');
const metaplex = require("@metaplex-foundation/mpl-token-metadata");

export async function getWalletNfts(wallet_address) {
    const connection = new web3.Connection(web3.clusterApiUrl('devnet'));
    const nfts = await metaplex.Metadata.findDataByOwner(connection, wallet_address);

    return nfts;
}
