const {hasNft} = require('../helpers/hasNft');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const {addWin} = require("../helpers/addWin");
const {addLoss} = require("../helpers/addLoss");

import {airdrop} from "../helpers/airdropSPL";
import { getId } from "../helpers/getId";
import { getJson } from "../helpers/getJson";
import {getWallet} from "../helpers/getWallet";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('meta')
		.setDescription('Gets the metadata of your NFT!'),

        
	async execute(interaction) {
        const fileId = await getId(interaction.member.id);
        console.log(fileId);
        const metadata = await getJson(fileId);
        //await interaction.reply(`Your metadata: ${JSON.stringify(metadata)}`);
        console.log(metadata)
        let fields: any[] = []

        for(let trait of metadata.attributes) {
            //console.log({name: trait, value: trait.value.toString()})
            let data = {name: trait.trait_type, value: trait.value.toString()}
            fields.push(data)
        }

        const embed = {
            title: "Metadata",
            description: "Your NFTs metadata!",
            fields: fields
        }

        await interaction.reply({embeds: [embed]})
    }

	};

