import { Fighter } from "../handler/fighterClass";
import { fight, genBattleUI } from "../handlers/calculateFight";
import { getSelected, send_selected } from "../helpers/send";
import { resetAll, battle_attendants, fighters} from '../main';

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
                console.log("Called");
                if(battle_attendants.length < 1) {
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
                    await interaction.reply({content: "Thank you for choosing an brave fighter.", ephemeral: true})
                    await interaction.channel.send({content: `The user ${interaction.user} just joined the fight. There are now ${battle_attendants.length} fighters!`, ephemeral: false});
                        
                } else {
                    if(battle_attendants.length === 1) {
                        const metadata = await getSelected(interaction)
                        const name = metadata.name;
                        battle_attendants 
                        for(var i = 0; i < metadata.attributes.length; i++) {
                            if(metadata.attributes[i].trait_type === 'ATTACK')
                            {
                                console.log(metadata.attributes[i].value);
                            }
                        }         
                        battle_attendants.push(interaction.user.id);
                        var fighter = new Fighter(metadata, interaction.user.id, interaction.values[0]);
                        fighters.push(fighter);

                        await interaction.reply({content: "Thank you for choosing an brave fighter.", ephemeral: true})
                        await interaction.channel.send({content: `The user ${interaction.user} just joined the fight. There are now ${battle_attendants.length} fighters!`, ephemeral: false});
                  
                        const result = await fight(fighters);
                        resetAll();

                        if(result) {
                            await interaction.channel.send("You won!");
                        } else {
                            await interaction.channel.send("You lost.");
                        }
                        
                } 
            }
        }
	},
};
