module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
        //const channel_id = "962430953811214436"
        //const channel = client.channels.cache.get(channel_id);
        
        //await channel.send("`✅ The Bot just restarted successfully.`")

		console.log("Ready");
	},
};
