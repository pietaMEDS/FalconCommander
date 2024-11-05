import { readFile, writeFile } from 'fs/promises';
import FindUserById from './utility/FindUserById.js';
import { ButtonBuilder, ButtonStyle, EmbedBuilder } from 'discord.js';

export default async (interaction) => {

    try {
        let user = await FindUserById(interaction.member.user.id)

        let conditions = ""
        let results = ""
        user.rank.condition.forEach(condition => {
            if (condition.value > 0) {
                conditions+=condition.desc+`
`
                results+=condition.value+`
`
            }
        });

        if (conditions=='') {
            conditions = "Критерии успешно выполнены"
        }

        let replyEmbed = new EmbedBuilder()
            .setColor("#E55A36")
            .setTitle("*Документ:*")
            .setAuthor({name: user.id+" "+user.name, iconURL: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar })
            .addFields(
                { name: "Подразделение:", value: user.guild },
                { name: 'Текущие звание', value: user.rank.name },
                { name: "Критерии", value:conditions, inline: true  },
            );

            if (results!="") {
                replyEmbed.addFields({ name: 'Осталось', value: results, inline:true },)
            }
            console.log("response embed:"+replyEmbed+" to "+interaction.member.nickname);
            if (
                interaction.member.roles.cache.some(role => role.name === 'Заместитель командира')
                ||
                interaction.member.roles.cache.some(role => role.name === 'Командир')
                ||
                interaction.member.roles.cache.some(role => role.name === 'Командование')
            ) {
                let officerButton = new ButtonBuilder()
                    .setCustomId("open:Officer")
                    .setLabel("Меню офицера")
                    .setStyle(ButtonStyle.Secondary);
                interaction.reply({embeds: [replyEmbed]})
            }
            else
            {
                interaction.reply({embeds: [replyEmbed]})
            }
    } catch (error) {
            console.log(error);
    }

}