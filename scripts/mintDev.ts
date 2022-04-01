const saveJson = require("../doggos-backend/helpers/saveJson.js");
var exec = require('child_process').exec;

async function uploadBlank() {

    let data = {"name":"Rock paper scissors","animation_url":"https://www.arweave.net/efgh1234?ext=mp4","properties":{"creators":[{"share":100,"address":"4X4mk7ZHHsBmJcsvqQhVLA5hHoRAsArf33GTxjN3KCYj"}],"files":[{"uri":"https://www.arweave.net/abcd5678?ext=png","type":"image/png"}],"category":"image"},"external_url":"https://solflare.com","description":"Gaming on discord, using SOL!","collection":{"family":"Sol games","name":"RPC"},"seller_fee_basis_points":0,"image":"https://www.arweave.net/abcd5678?ext=png","symbol":"","attributes":[{"trait_type":"wins","value":0},{"value":0,"trait_type":"losses"}]}

    const saved_json = await saveJson(data);
    
    console.log(`http://217.160.240.86:3331/files/${saved_json}`);
}

async function mint(wallet) {
    const uri = await uploadBlank();

    const command = `ts-node /Users/lennard/metaplex/js/packages/cli/src/cli-nft.ts mint -u ${uri} -k /Users/lennard/.config/solana/id.json -w ${wallet}`;
    console.log(command);

    exec(command, function(error, stdout, stderr) {
        console.log(stdout);
    });
}  

async function airdrop(wallet, amount) {

    const command = `spl-token transfer 9eEjtpJ3UHhPtvYJ7iAhcW6cA5teKJWiTJndg7gFafkJ ${amount} ${wallet}`

    exec(command, function(error, stdout, stderr) {
        console.log(stdout);
    });
}

uploadBlank();