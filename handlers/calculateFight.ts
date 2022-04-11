const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} = require('discord.js');

export async function genBattleUI(fighter) {
    console.log(fighter.metadata);
    let move_one = fighter.metadata.attributes.find(element => element.trait_type == "MOVE_ONE").value;
    let move_two = fighter.metadata.attributes.find(element => element.trait_type == "MOVE_TWO").value;
    let move_three = fighter.metadata.attributes.find(element => element.trait_type == "MOVE_THREE").value;
    let move_four = fighter.metadata.attributes.find(element => element.trait_type == "MOVE_FOUR").value;

    const row = new MessageActionRow()
			.addComponents(
				new MessageButton()
					.setCustomId('move_one')
					.setLabel(move_one)
					.setStyle('PRIMARY')
                    .setEmoji("🗡️"),
                new MessageButton()
					.setCustomId('move_two')
					.setLabel(move_two)
					.setStyle('PRIMARY')
                    .setEmoji("🗡️"),
                new MessageButton()
					.setCustomId('move_three')
					.setLabel(move_three)
					.setStyle('PRIMARY')
                    .setEmoji("🗡️"),
                new MessageButton()
					.setCustomId('move_four')
					.setLabel(move_four)
					.setStyle('PRIMARY')
                    .setEmoji("🗡️"),                    
			); 

    return row;
 }
    
