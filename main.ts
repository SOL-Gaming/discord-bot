const fs = require('node:fs');
const {Client,Collection,Intents} = require('discord.js');
const {token} = require('./config.json');

import { EmbedType } from "discord-api-types/v10";
import { Fighter } from "./handler/fighterClass";
import { genBattleUI } from "./handlers/calculateFight";
import { keyWordHandler } from "./handlers/keyWord";
import {send_selected, getSelected} from './helpers/send';

const client = new Client({intents: [Intents.FLAGS.GUILD_MESSAGES,Intents.FLAGS.GUILDS]});
client.commands = new Collection();
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} = require('discord.js');

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') || file.endsWith(".ts"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}

const eventFiles = fs.readdirSync('./events');

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

export var data = new Array();
export var battle_attendants: any[] = [];
export let fighters: any[] =  [];

export function resetFighters() {fighters = []}
export function resetAll() {fighters = []
	battle_attendants = []}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.channel.send({ content: 'There was an error while executing this command!', ephemeral: false });
	}
});

client.login(token);