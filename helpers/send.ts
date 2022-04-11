import { getJson } from "./getJson";
const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu} = require('discord.js');

export async function send_selected(interaction) {
    const metadata = await getJson(interaction.values[0]);
    console.log(metadata.image);
    let fields: any[] = []
    for(let trait of metadata.attributes) {
        let data = {name: trait.trait_type, value: trait.value.toString(), inline: true}
        fields.push(data)
    }

    const embed = new MessageEmbed()
    .setTitle("Metadata")
    .setDescription(`This is the metadata of the NFT: ${metadata.name})`)
    .addFields(fields)
    .setThumbnail(`${metadata.image}?size=48`)

    await interaction.reply({embeds: [embed]})
}

export async function getSelected(interaction) {
    const metadata = await getJson(interaction.values[0]);
    const name = metadata

    return name;
}