import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, Embed, EmbedBuilder, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { readFile } from 'fs/promises';
import MemberSort from '../utility/MemberSort.js';
export default async (interaction) => {

    let users = JSON.parse( await readFile("./data/users.json"))
    let soldiers = interaction.fields.fields.get("soldiers").value.split(",")
    let results = interaction.fields.fields.get("result").value.split(",")
    let activies = ''
    let ResponseResults = ''


    soldiers.forEach(soldier => {
        if(soldier.trim().split(" ").length == 1){
            users.users.forEach(member => {
                if (soldier.toLowerCase().trim() == member.name.toLowerCase().trim()) {
                    activies+="- "+member.guild+" "+member.rank.name+" "+member.id+" "+member.name+`
`
                }
            })
        }
        else{
            activies+="- "+soldier.trim()+`
`
        }
     });

     results.forEach(result => {
        ResponseResults+= result.trim()+`
`
     });

    let date = new Date();
    let day;
    if (date.getDate() < 10) {
        day = "0"+date.getDate()
    }
    else{
        day = date.getDate()
    }
    let month = date.getMonth()+1    
    
    try{
        let replyEmbed = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle("*Рапорт о проведении обучения*")
        .setAuthor({name: "Организатор: "+interaction.member.nick, iconURL: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar })
        .addFields(
            { name: "Специализация: ", value: interaction.fields.fields.get("spec").value },
            { name: '\u200B', value: ' ' },
            { name: "Участники", value:activies, inline: true  },
            { name: ' ', value: ' ', inline:true },
            { name: "Результаты", value: ResponseResults, inline: true  },
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


// **Рапорт о проведении тренировки**
// ```
// Проводил -> 212th CTP 0037 Pieta
// Дата -> 21.10.2024
// Тренировка -> Работа с техникой
// Группа ->
// * 212th PV2 2107 Prophet
// ```

// // at the top of your file
// const { EmbedBuilder } = require('discord.js');

// // inside a command, event listener, etc.
// const exampleEmbed = new EmbedBuilder()
// 	.setColor(0x0099FF)
// 	.setTitle('Some title')
// 	.setURL('https://discord.js.org/')
// 	.setAuthor({ name: 'Some name', iconURL: 'https://i.imgur.com/AfFp7pu.png', url: 'https://discord.js.org' })
// 	.setDescription('Some description here')
// 	.setThumbnail('https://i.imgur.com/AfFp7pu.png')
// 	.addFields(
// 		{ name: 'Regular field title', value: 'Some value here' },
// 		{ name: '\u200B', value: '\u200B' },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 		{ name: 'Inline field title', value: 'Some value here', inline: true },
// 	)
// 	.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
// 	.setImage('https://i.imgur.com/AfFp7pu.png')
// 	.setTimestamp()
// 	.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

// channel.send({ embeds: [exampleEmbed] });

// https://cdn.discordapp.com/avatars/+