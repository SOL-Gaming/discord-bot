const web3 =  require('@solana/web3.js');
const splToken = require('@solana/spl-token');

(async () => {

    //create connection to devnet
    const connection = new web3.Connection(web3.clusterApiUrl("devnet"));

    //generate keypair and airdrop 1000000000 Lamports (1 SOL)
    const myKeypair = web3.Keypair.generate();
    console.log(myKeypair);
    await connection.requestAirdrop(myKeypair.publicKey, 1000000000);

    console.log('solana public address: ' + myKeypair.publicKey.toBase58());

    //set timeout to account for airdrop finalization
    let mint;
    var myToken
    setTimeout(async function(){ 

        //create mint
        mint = await splToken.Token.createMint(connection, myKeypair, myKeypair.publicKey, null, 9, splToken.TOKEN_PROGRAM_ID)

        console.log('mint public address: ' + mint.publicKey.toBase58());

        //get the token accont of this solana address, if it does not exist, create it
        myToken = await mint.getOrCreateAssociatedAccountInfo(
            myKeypair.publicKey
        )

        console.log('token public address: ' + myToken.address.toBase58());

        //minting 100 new tokens to the token address we just created
        await mint.mintTo(myToken.address, myKeypair.publicKey, [], 1000000000);

        console.log('done');

    }, 20000);

})();