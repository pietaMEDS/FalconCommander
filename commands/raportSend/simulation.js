import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, Embed, EmbedBuilder, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { readFile } from 'fs/promises';
import MemberSort from '../utility/MemberSort.js';
export default async (interaction) => {

    let users = JSON.parse( await readFile("./data/users.json"))
    let soldiers = interaction.fields.fields.get("soldiers").value.split(",")
    let activies = await MemberSort(interaction, soldiers, users, interaction.member.nickname)
    
    let date = new Date();
    let day;
    if (date.getDate() < 10) {
        day = "0"+date.getDate()
    }
    else{
        day = date.getDate()
    }
    let month = date.getMonth()+1

    if (activies == false) {
        interaction.reply({content:"Напоминаю! рапорта пишутся старшим в подразделении на момент события!", ephemeral:true})
        return;
    }

    console.log(`Запрос на отправку формы:
        ID: `+interaction.customId+`
        Initiator: `+interaction.member.nickname+`
        Fields:
        `+JSON.stringify(interaction.fields.fields, null, 2)+`
        `);
    
    try{
        let replyEmbed = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle("*Рапорт о проведении симуляции*")
        .setAuthor({name: "Организатор: "+interaction.member.nickname, iconURL: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar })
        .addFields(
            { name: "Сложность симуляции", value: interaction.fields.fields.get("dificult").value },
            { name: '\u200B', value: ' ' },
            { name: "Участники", value:activies, inline: true  },
            { name: ' ', value: ' ', inline:true },
            { name: "Результат", value:interaction.fields.fields.get("result").value, inline: true  },
            { name:"\u200B", value:"Дата: "+ day +"."+month } 
        )

        let confirm = new ButtonBuilder()
            .setCustomId('confirm:Officer')
            .setLabel('Одобрить рапорт')
            .setStyle(ButtonStyle.Success)
            .setEmoji('1233846475805425835');

        let cancel = new ButtonBuilder()
            .setCustomId('cancel:Officer')
            .setLabel('Отклонить рапорт')
            .setStyle(ButtonStyle.Danger)
            .setEmoji('1233846477470830654');

        let ButtonComponent = new ActionRowBuilder().addComponents(confirm, cancel)


        interaction.reply({embeds: [replyEmbed], components: [ButtonComponent] })
    }
    catch (err){
        console.log(err);
    }

    
}