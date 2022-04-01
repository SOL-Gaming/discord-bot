const web3 =  require('@solana/web3.js');

const myKeypair = web3.Keypair.generate();
console.log(myKeypair);