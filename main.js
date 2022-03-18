const fs = require('node:fs');
const {
    Client,
    Collection,
    Intents
} = require('discord.js');
const {
    token
} = require('./config.json');

const client = new Client({
    intents: [Intents.FLAGS.GUILDS]
});
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

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

	if (!command) {
        try { await interaction.reply({ content: 'This command was not found! Please use `/help` for a detailed help list.'}) } catch (err) {console.log("ERR")}
    }

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: false });
	}
});

client.login(token);