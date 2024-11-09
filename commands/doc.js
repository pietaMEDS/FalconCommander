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
                { name: "Подразделение:", value: user.guild, inline: true},
            );
            if (interaction.member.roles.cache.some(role => role.name === 'Отряд воздушной поддержки - Могильщик')) {
                replyEmbed.addFields(
                    { name: "Отряд:", value: "Могильщик", inline: true},
                );
            }
            else if(interaction.member.roles.cache.some(role => role.name === 'Десантный отряд - Кинжал')){
                replyEmbed.addFields(
                    { name: "Отряд:", value: "Кинжал", inline: true},
                );
            }
            else if(interaction.member.roles.cache.some(role => role.name === 'Медицинский отряд - Панацея')){
                replyEmbed.addFields(
                    { name: "Отряд:", value: "Панацея", inline: true},
                );
            }
            else if(interaction.member.roles.cache.some(role => role.name === 'Дисциплинарный отряд - Рубеж')){
                replyEmbed.addFields(
                    { name: "Отряд:", value: "Рубеж", inline: true},
                );
            }
            replyEmbed.addFields(
                { name: 'Текущие звание', value: user.rank.name },
                { name: "Критерии", value:conditions, inline: true  },
            );

            if (results!="") {
                replyEmbed.addFields({ name: 'Осталось', value: results, inline:true },)
            }
            console.log("response embed:"+" docs "+" to "+interaction.member.nickname);
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