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

import {data} from '../main';

module.exports = { data: new SlashCommandBuilder()
    .setName('testboss')
    .setDescription('Creates a new Boss to test.'),


    async execute(interaction) {
        const channel_id = "962428943531642920"
        const channel = interaction.client.channels.cache.get(channel_id);
    
        const bossBattleEmbed = new MessageEmbed()
        .setTitle("Boss battle")
        .setDescription("A new boss battle has started, and will be summoned soon. Add your mutantmons to gain rewards with others!\n\n**Please allow a few seconds for the bot to calculate.**")
    
        
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setCustomId('join')
                .setLabel('Join this fight!')
                .setStyle('PRIMARY')
                .setEmoji('➕')
        );
    
        const battleMessage = await channel.send({embeds: [bossBattleEmbed], components: [row]})
        data.push(battleMessage.id);
        await interaction.reply("The command was executed.");

        const joinEmbed = new MessageEmbed()
        .setTitle("Join the battle")
        .setDescription("Please use the dropdown below to select an NFT to use in this battle.\n\n**Please allow a few seconds for the bot to calculate.**")

        const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

        collector.on('collect', async inter => {
            if(inter.customId === "join") {

                await inter.deferReply({ephemeral: true});
                const options: any[] = [];

                const wallet = "4X4mk7ZHHsBmJcsvqQhVLA5hHoRAsArf33GTxjN3KCYj"
                const nfts = await getWalletNfts(wallet);
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
                } catch {}
                
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
                                .setCustomId('select_nft_battle')
                                .setPlaceholder('Nothing selected')
                                .addOptions(message_options),
                    );
                    
                    await inter.editReply({embeds: [joinEmbed], components: [row], ephemeral: true});
             }}
            
        })

    
    }}