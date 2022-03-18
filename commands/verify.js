const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Allows a user to connect their wallet with the game.'),

        
	async execute(interaction) {
		const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('interaction_verification_role')
					.setLabel('✅ Get added to the role.')
					.setStyle('PRIMARY'),
			);

		const verificationEmbed = new MessageEmbed()
			.setColor('#0099ff')
			.setTitle('Holder Verification')
			.setDescription('We are happy you are here!\nAs next step it is important that you verify your NFT. To do this, visit the given link below and connect the account to your Phantom Wallet.\nAfter you did this, interact with the button to get the roles.')
			.addField('Verify here 🔗', '[Link](https://127.0.0.1:2001) to the verification.', true)
			.setTimestamp()
			.setFooter({ text: 'lennardeth' });

	await interaction.reply({ embeds: [verificationEmbed], components: [row] });

	},
};
