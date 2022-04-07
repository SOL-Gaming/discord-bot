const fs = require('node:fs');
const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const {
    token
} = require('./config.json');

import { keyWordHandler } from "./handlers/keyWord";

const client = new Client({
    intents: [
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILDS
     ]
});
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js') || file.endsWith(".ts"));

for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);
}
client.once('ready', () => {
    console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    const command = client.commands.get(interaction.commandName);
    //console.log(command);
	/*if (!command) {
        try { await interaction.reply({ content: 'This command was not found! Please use `/help` for a detailed help list.'}) } catch (err) {console.log("ERR")}
    }*/

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: false });
	}
});

client.on('interactionCreate', async interaction => {
    if (interaction.isButton()) {
        if(interaction.customId === "player_verification") {
            await interaction.reply({ content:"You have entered the figh. Now waiting for the enemy to join.", ephemeral: true });
        }
    }
	
    if(interaction.customId === "interaction_verification_role") {
        await interaction.update({ content: 'A button was clicked!', components: [] });
    }
});


client.on('messageCreate', async message => {
    //console.log(message);
	//await keyWordHandler(message.author, message.content);
});

client.login(token);