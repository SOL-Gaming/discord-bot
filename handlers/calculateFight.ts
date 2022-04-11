import { TriedToReplaceAnExistingReservationError } from "@metaplex-foundation/mpl-token-metadata";
import { Boss } from "../handler/bossClass";
import { fighters } from "../main";

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
    
export async function fight(fighters) {
	console.log(fighters.forEach(element => {
		console.log(element);
	}));

	const health = Math.floor(Math.random() * (10000 + 1));
	const damage = Math.floor(Math.random() * (1000 + 1));

	const boss = new Boss(damage, health);

	let full_health = 0;
	let full_damage = 0;

	for(let fighter of fighters) {
		let health = Math.floor(Math.random() * (700 + 1));
		let damage = Math.floor(Math.random() * (100 + 1));
		
		full_health = full_health + health;
		full_damage = full_damage + damage;
	}

	if(full_health >= damage && full_damage >= health) {
		return true;
	} 
} 