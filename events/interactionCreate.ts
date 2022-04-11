import { Fighter } from "../handler/fighterClass";
import { genBattleUI } from "../handlers/calculateFight";
import { getSelected, send_selected } from "../helpers/send";
import { resetFighters, battle_attendants, fighters} from '../main';

module.exports = {
	name: 'interactionCreate',
	async execute(interaction) {
        if (interaction.isButton()) {
            if(interaction.customId === "player_verification") {
                await interaction.reply({ content:"You have entered the figh. Now waiting for the enemy to join.", ephemeral: true });
            }
        }
        
        if(interaction.customId === "interaction_verification_role") {
            await interaction.update({ content: 'A button was clicked!', components: [] });
        }

		if (!interaction.isSelectMenu()) return;
            if(interaction.customId === "select_nft") {
                await send_selected(interaction);
            } else if(interaction.customId === "select_nft_battle") {
        
                if(battle_attendants.length < 2) {
                    const metadata = await getSelected(interaction)
                    const name = metadata.name;
                
                    for(var i = 0; i < metadata.attributes.length; i++) {
                        if(metadata.attributes[i].trait_type === 'ATTACK')
                        {
                            console.log(metadata.attributes[i].value);
                        }
                    }
        
        
                    battle_attendants.push(interaction.user.id);
        
                    var fighter = new Fighter(metadata, interaction.user.id, interaction.values[0]);
                    fighters.push(fighter);
                    await interaction.reply("Thank you for choosing an brave fighter.")
                    await interaction.channel.send({content: 
                        `The user ${interaction.user} just joined the fight. There are now ${battle_attendants.length} fighters!`, ephemeral: false})
        
                    const UI = await genBattleUI(fighters[0]);
                    //await interaction.channel.send({content: "Please select the move for the fight.", components: [UI]});
                    //fighters = [];
                } else {
                    if(battle_attendants.length === 5) {
                        const UI = await genBattleUI(fighters);
                        await interaction.channel.send({content: "Please select the move for the fight.", components: [UI]});
                        resetFighters();
                } 
            }
        }
	},
};
