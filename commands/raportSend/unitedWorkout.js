import { ActionRowBuilder, ButtonBuilder, ButtonStyle, Client, Colors, Embed, EmbedBuilder, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { readFile } from 'fs/promises';
import MemberSort from '../utility/MemberSort.js';
import { env } from 'process';
import 'dotenv/config'
const RAPORT_ID =  JSON.parse(process.env.RAPORT_ID)

export default async (interaction, client) => {

    let users = JSON.parse( await readFile("./data/users.json"))
    let soldiers = interaction.fields.fields.get("soldiers").value.split(",")
    let activies = ''

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

    try {
        let replyEmbed = new EmbedBuilder()
        .setColor("#ffffff")
        .setTitle("*Рапорт о проведении совместной тренировки*")
        .setAuthor({name: "Организатор: "+interaction.member.nickname, iconURL: "https://cdn.discordapp.com/avatars/"+interaction.user.id+"/"+interaction.user.avatar })
        .addFields(
            { name: interaction.fields.fields.get("workoutName").value, value: interaction.fields.fields.get("desc").value },
            { name: '\u200B', value: '\u200B' },
            { name:"Участники", value:activies, inline: true  },
            { name:"\u200B", value:"Дата: "+day+"."+month } 
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
    } catch (error) {
        console.log(error);
    }
}