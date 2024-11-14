import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, Embed, EmbedBuilder, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { readFile } from 'fs/promises';
import MemberSort from '../utility/MemberSort.js';
export default async (interaction) => {
    
    let date = new Date();
    let day;
    if (date.getDate() < 10) {
        day = "0"+date.getDate()
    }
    else{
        day = date.getDate()
    }
    let month = date.getMonth()+1

    console.log(`Запрос на отправку формы:
        ID: `+interaction.customId+`,
        Initiator: `+interaction.member.nickname+`,
        Fields:
        `+JSON.stringify(interaction.fields.fields, null, 2)+`
        `);

    try{
        let replyEmbed = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle("*Заявка на вступление*")
        .setAuthor({name: interaction.member.nickname, iconURL: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar })
        .addFields(
            { name: "SteamID: ", value: interaction.fields.fields.get("SteamId").value },
            { name: 'Часовой пояс: ', value: interaction.fields.fields.get("WorldHour").value },
            // { name:"Дополнительная информация: ", value:interaction.fields.fields.get("desc").value  },
            // { name:"\u200B", value:"Дата: "+ day +"."+month } 
        )

        if (interaction.fields.fields.get("desc").value) {
            replyEmbed.addFields({
                name:"Дополнительная информация: ", value:interaction.fields.fields.get("desc").value
            })
        }

        replyEmbed.addFields({
            name:"\u200B", value:"Дата: "+ day +"."+month
        })

        let confirm = new ButtonBuilder()
            .setCustomId('confirm:invite')
			.setLabel('Одобрить заявку')
			.setStyle(ButtonStyle.Success)
            .setEmoji('1233846475805425835');

        let cancel = new ButtonBuilder()
            .setCustomId('cancel:Officer')
			.setLabel('Отклонить заявку')
			.setStyle(ButtonStyle.Danger)
            .setEmoji('1233846477470830654');

        let ButtonComponent = new ActionRowBuilder().addComponents(confirm, cancel)

        interaction.reply({embeds: [replyEmbed], components: [ButtonComponent] })
    }
    catch(err){
        console.log(err);
    }
    
}