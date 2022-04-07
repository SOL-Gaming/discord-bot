import { Routes } from "discord-api-types/v9";
const { SlashCommandBuilder } = require('@discordjs/builders');
const { REST } = require('@discordjs/rest');
const { clientId, guildId, token } = require('./config.json');

const commands = [
    new SlashCommandBuilder()
    .setName('verify')
    .setDescription('Allows holders to verify the ownership of their NFT to lik it to their Discord account.'),

    new SlashCommandBuilder()
		.setName('play')
		.setDescription('Allows a user to play.'),

	new SlashCommandBuilder()
		.setName('rpc')
		.setDescription('Allows a user to play rock paper scissors.')
		.addUserOption(option =>
            option
                .setName('user')
                .setDescription('The user you want to hug')
                .setRequired(true)
        ),
  new SlashCommandBuilder()
        .setName('meta')
        .setDescription('Gets the metadata of your NFT!'),
            
]
	.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(token);

rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: commands })
	.then(() => console.log('Successfully registered application commands.'))
	.catch(console.error);
