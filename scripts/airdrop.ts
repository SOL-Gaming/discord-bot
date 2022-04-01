import * as fs from "fs";

const util = require("util")
const exec = util.promisify(require('child_process').exec);

const token = "q69qV2vUBTtMLJesPUkrX4s6msPX3td3cfRFRThqsE6"

async function main() {
    console.log("==> Loading Wallets")
    const data = fs.readFileSync("./whitelist.txt", 'utf8')
		const wallets = data.toString().split(/\r?\n/)
    console.log("==> Found", wallets.length, "owners receiving airdrop")
    console.log("==> Starting transfers")
    const transfers = []

		for (let i = 0; i < wallets.length; i++) {
        const cmd = 'spl-token transfer ' + token + ' 1 ' + wallets[i] + " --fund-recipient --allow-unfunded-recipient"
        console.log(wallets[i]);
				// try {
				// 	const { stdout, stderr } = await exec(cmd);
				// 	console.log('stdout:', stdout);
				// 	console.log('stderr:', stderr);
				// } catch (e) {
				// 	console.error(e); // should contain code (exit code) and signal (that caused the termination).
				// }
				transfers.push(exec(cmd))
        await new Promise(f => setTimeout(f, 5000));
        console.log("done #",i+1);
    }

    const chunksTransfer = chunkArrayByNumber(transfers, 5)

    for (let i = 0; i < chunksTransfer.length; i++) {
        console.log("==> Processing transfer chunk", i+1, "of", chunksTransfer.length)
        await Promise.all(chunksTransfer[i])
    }

}

function chunkArrayByNumber(items: string[], elements: number) {
    const res = []
    for (let i = 0; i < items.length; i += elements) {
        const chunk = items.slice(i, i + elements)
        res.push(chunk)
    }
    return res
}

(async () => await main())();