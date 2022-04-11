const {hasNft} = require('../helpers/hasNft');
import { Metadata } from '@metaplex-foundation/mpl-token-metadata';
import { PublicKey } from '@solana/web3.js';
import { clusterApiUrl, Connection, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} = require('discord.js');

const {addWin} = require("../helpers/addWin");
const {addLoss} = require("../helpers/addLoss");

import {airdrop} from "../helpers/airdropSPL";
import { getId } from "../helpers/getId";
import { getJson } from "../helpers/getJson";
import {getWallet} from "../helpers/getWallet";
import { getWalletNfts } from "../helpers/getWalletNfts";


module.exports = { data: new SlashCommandBuilder()
    .setName('meta')
    .setDescription('Gets the metadata of your NFT!'),


    async execute(interaction) {
        const options: any[] = [];

        const wallet = "4X4mk7ZHHsBmJcsvqQhVLA5hHoRAsArf33GTxjN3KCYj"
        const nfts = await getWalletNfts(wallet);
        await interaction.reply({content: "The Bot is fetching your NFTs and will send you an message to select one to view. Make sure to allow a few seconds."});
        try {  
            for(let nft of nfts.value) {
                let metadataProgramIdKey = new PublicKey( "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" );

                let [address, nonce] = await PublicKey.findProgramAddress( [ Buffer.from("metadata", "utf8"), metadataProgramIdKey.toBuffer(), new PublicKey(nft.account.data.parsed.info.mint).toBuffer(), ], metadataProgramIdKey );
            
                const connection = new Connection(clusterApiUrl('devnet'));
                
            try {          
                const meta_oc = await Metadata.fromAccountAddress(connection,address)                
                    if(meta_oc.collection?.key.toString() === "Df5ZwzMPAFSatLjZTXTozRyVPHbYtHLuuf7ZnfbsoigS") {
                        options.push(meta_oc);
                    } 
                } catch(e) {
                }
            }
        } catch {
            
        }
        
        try {
        if(options.length > 0) {

            const message_options: any[] = [];

            for(var i = 0; i < options.length; i++ ){
                const metadata = await getJson(options[i].data.uri.replace(/[^\x00-\x7F]/g, "").split("/")[4]);
                let id = options[i].data.uri.replace(/[^\x00-\x7F]/g, "").split("/")[4];
                message_options.push({label: metadata.name, value: `${id.replace(/[^A-Za-z 0-9 \.,\?""!@#\$%\^&\*\(\)-_=\+;:<>\/\\\|\}\{\[\]`~]*/g, '')}`}, );
            }
            const row = new MessageActionRow()
			    .addComponents(
				    new MessageSelectMenu()
                        .setCustomId('select_nft')
                        .setPlaceholder('Nothing selected')
                        .addOptions(message_options),
			);

            const select_embed = new MessageEmbed()
            .setTitle("Selection")
            .setDescription("Please select an NFT of the dropdown, to display its metadata!");

		    await interaction.channel.send({embeds: [select_embed], components: [row], ephemeral: true});

            //console.log(row.components[0].options[0]);
        } 

    } catch (e) {
        console.log(e);
    }
    }}