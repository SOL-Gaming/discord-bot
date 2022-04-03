const {hasNft} = require('../helpers/hasNft');

const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

const {addWin} = require("../helpers/addWin");
const {addLoss} = require("../helpers/addLoss");

import {airdrop} from "../helpers/airdropSPL";
import {getWallet} from "../helpers/getWallet";

module.exports = {
	data: new SlashCommandBuilder()
		.setName('rpc')
		.setDescription('Allows holders to verify the ownership of their NFT to lik it to their Discord account.')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to hug')
                .setRequired(true)
        ),
	async execute(interaction) {
        console.log("Sender user id: " + interaction.member.user.id.toString())
        console.log("Opponent user id: " + interaction.options.getUser('user').id.toString())
        const sender_wallet = await getWallet(interaction.member.user.id.toString());
        const partner_wallet = await getWallet(interaction.options.getUser('user').id.toString());

        const start_embed = new MessageEmbed()
            .setTitle('Starting screen')
            .setColor("#32CD32")
            .setDescription("Please click the play button. Both players will recieve a DM by the Bot, to start and select an operation. There is a time limit, so be fast.");

        const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('player_verification')
					.setLabel('Accept duel.')
                    .setEmoji("916257394655391754")
					.setStyle('PRIMARY'),
		);

        const debug_perms = true;

        const partner_id = interaction.options.getUser('user').id;

        const partner_perms = hasNft(interaction.options.getUser('user').id.toString());
        const sender_perms = hasNft(interaction.member.user.id.toString());

        if(debug_perms) {
            
            await interaction.reply({ components: [row], embeds: [start_embed], fetchReply: true});
            const partner_mention = await interaction.channel.send(`${interaction.options.getUser('user')} you have been challenged to play!`);
        
            const collector = interaction.channel.createMessageComponentCollector({ time: 15000 });

            collector.on('collect', async i => {
                
                if(i.member.user.id == partner_id && i.customId === "player_verification") {
                    collector.stop();
                    const game_embed = new MessageEmbed()
                        .setTitle("Selection")
                        .setColor("#32CD32")
                        .setDescription("Please select the action you wish to play.");

                    const actions_row = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setCustomId('rock_move')
                                .setLabel('Rock')
                                .setEmoji("🪨")
                                .setStyle('PRIMARY'),
                        
                            new MessageButton()
                                    .setCustomId('paper_move')
                                    .setLabel('Paper')
                                    .setEmoji("🧻")
                                    .setStyle('PRIMARY'), 

                            new MessageButton()
                                    .setCustomId('scissors_move')
                                    .setLabel('Scissors')
                                    .setEmoji("✂️")
                                    .setStyle('PRIMARY')
                            ); 
                    
                    //console.log(interaction.user);
                    let name = `${interaction.user.username}-${interaction.options.getUser('user').username}`;
                    
                    interaction.guild.channels.create(name, {
                        type: 'text',
                    }).then(async(channel) => {
                        channel.setParent("959455341756678164");
                        await channel.send({embeds: [game_embed], components: [actions_row]});

                        channel.permissionOverwrites.create(channel.guild.roles.everyone, { VIEW_CHANNEL: true, SEND_MESSAGES: false });
                        channel.permissionOverwrites.create(interaction.member.user.id, { VIEW_CHANNEL: true, SEND_MESSAGES: false });
                        channel.permissionOverwrites.create(partner_id, { VIEW_CHANNEL: true, SEND_MESSAGES: false });

                        const game_collector = channel.createMessageComponentCollector({ time: 150000 });
                        let player_1_sent = false;
                        let player_2_sent = false;

                        let player_1_choice = "";
                        let player_2_choice = "";

                        async function onSent(event, player_1_choice, player_2_choice) {
                            let array = ["p1", "p2"];
                            let winner = "";

                            // P1 = ich

                            if(player_1_choice === "rock_move" && player_2_choice === "paper_move") {
                                winner = "p2";
                            } else if(player_1_choice === "rock_move" && player_2_choice === "scissors_move") {
                                winner = "p1";
                            } else if(player_1_choice === "rock_move" && player_2_choice === "rock_move") {
                                winner = array[Math.floor(Math.random() * array.length)];
                            } else if(player_1_choice === "paper_move" && player_2_choice === "rock_move") {
                                winner = "p2";
                            } else if(player_1_choice === "paper_move" && player_2_choice === "scissors_move") {
                                winner = "p2";
                            } else if(player_1_choice === "paper_move" && player_2_choice === "paper_move") {
                                winner = array[Math.floor(Math.random() * array.length)];
                            } else if(player_1_choice === "scissors_move" && player_2_choice === "paper_move") {
                                winner = "p2";
                            } else if(player_1_choice === "scissors_move" && player_2_choice === "rock_move") {
                                winner = "p1";
                            } else if(player_1_choice === "scissors_move" && player_2_choice === "scissors_move") {
                                winner = array[Math.floor(Math.random() * array.length)];
                            } else {
                                console.log(`P1: ${player_1_choice} | P2: ${player_2_choice}`)
                                winner = "";
                            }
                            
                            switch (winner) {
                                case "p1":
                                    await addWin(interaction.member.user.id.toString());
                                    await addLoss(partner_id);
                                    await airdrop(sender_wallet, 100).then(async sig => {
                                        console.log(sig);
                                        await interaction.channel.send(`SPL signature: ${sig}`);
                                    });
                                    
                                    await channel.send({content:`${interaction.member} won`})
                                    break;
                                case "p2": 
                                    await addWin(partner_id);
                                    await addLoss(interaction.member.user.id.toString());
                                    await airdrop(partner_wallet, 10).then(async sig => {
                                        console.log(sig);
                                        await interaction.channel.send(`SPL signature: ${sig}`);
                                    });

                                    await channel.send({content:`${interaction.options.getUser('user')} won`});
                                    break;
                                case "": 
                                    await channel.send({content:`there is no winner`});
                                    break;
                                default: 
                                    await channel.send({content:`there is no winner`});
                            }
                        }   

                        game_collector.on('collect', async event => {
                            if(event.member.user.id === interaction.member.user.id && ["rock_move", "paper_move", "scissors_move"].includes(event.customId)) {
                                console.log("Partner logged the move: " + event.customId);
                                player_1_choice = event.customId;
                                player_1_sent = true;
                                await event.reply({content: "You successfully selected your action. ", ephemeral: true});

                                if(player_2_sent === true) {
                                    console.log("Both are done");
                                    game_collector.stop();
                                    onSent(event, player_1_choice, player_2_choice);
                                } else {
                                    await event.reply({content: "You successfully selected your action. ", ephemeral: true});
                                }

                            } else if(event.member.user.id === partner_id && ["rock_move", "paper_move", "scissors_move"].includes(event.customId)) {
                                console.log("Opponent logged the move: " + event.customId);
                                player_2_choice = event.customId;
                                player_2_sent = true;
                                
                                if(player_1_sent === true) {
                                    console.log("Both are done");
                                    game_collector.stop();
                                    onSent(event, player_1_choice, player_2_choice);
                                } else {
                                    await event.reply({content: "You successfully selected your action. ", ephemeral: true});
                                }
                        }


                        });
                    });

                } else {
                    return;
                } 
            });
            
            collector.on('end', async (collected, reason) => {
                if(reason == 'time') {
                    console.log("Time is over.");
                    
                    const timeout_embed = new MessageEmbed()
                        .setTitle('Duel timeout')
                        .setColor("#880808")
                        .setDescription("The time is over. To start a duel please use the command again.");

                    
                    await interaction.editReply({embeds: [timeout_embed], components: []});
                    await partner_mention.delete();
                }
            }
        )} else {
            await interaction.channel.send(`You and ${interaction.options.getUser('user')} do not have permission to play this game ;)`);
        }
    }
};
