import { error, log } from 'console';
import { env } from 'process';
// const wait = require('node:timers/promises').setTimeout;
// import { wait } from "node:timers/promises"
import { setTimeout } from 'node:timers/promises'
import { ActionRowBuilder, EmbedBuilder, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { readFile, writeFile } from 'fs/promises';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import 'dotenv/config'

const RAPORT_ID = JSON.parse(process.env.RAPORT_ID)
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import { exec } from 'child_process';
import ModalMake from './modals/workout.js';
import workoutSend from './commands/raportSend/workout.js';
import UnitedworkoutSend from './commands/raportSend/unitedWorkout.js';
import OtherSend from './commands/raportSend/other.js';
import SimulationSend from './commands/raportSend/simulation.js';
import PostSend from './commands/raportSend/post.js';
import EventSend from './commands/raportSend/event.js';
import LectureSend from './commands/raportSend/lecture.js';
import TrainigSend from './commands/raportSend/training.js';
import DocSend from './commands/doc.js';
import ConfirmCondition from './commands/utility/ConfirmCondition.js'
import invite from './commands/raportSend/invite.js';
import { SelectTypeSend } from './commands/utility/RankUpProcedure.js';

async function RankStabiliser( rank ){

  console.log("Стабилизация ранга.. "+rank);
  
  let rankJson;
  let ranksData = JSON.parse( await readFile("./data/ranks.json"))
  ranksData.ranks.forEach(rankElement => {
      if (rankElement.name.toUpperCase() == rank.toUpperCase()) {
      rankJson = rankElement
    }
    rankElement.subnames.forEach( ranksubname =>{
      if (ranksubname.toUpperCase() == rank.toUpperCase()) {
        rankJson = rankElement
      }
    })
  })
  if (!rankJson) {
    console.log("Подходящий ранг не найден");
    
    return false
  }

  console.log("Подходящий ранг найден");
  return rankJson
}

client.on('ready', () => {
  console.log(`Вход выполнен как ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  try{
  if (interaction.member.nick) {
    interaction.reply({content:"Я не работаю на серверах этого типа!", ephemeral: true})
    console.log("request from unregistered server, pusher:"+ interaction.member.nick +", end");
    return;
  }

  if (process.env.DEV) {
    if (interaction.member.user.id != 428170232029511680) {
      await interaction.reply({content:"Идут технические работы по настройке обновления, пожалуйста попробуйте в следующий раз", ephemeral:true})
      console.log("decline push from "+interaction.member.nickname+", end");
      return;
    }
  }

  if (interaction.commandName) {
    console.log("request "+interaction.commandName+" from "+interaction.member.nickname);
  } 

  switch (interaction.commandName) {
    case "docs":
      DocSend(interaction);
    break;
    case 'reload':
      try {
        console.log('Обновление слеш комманд..');

        let commands = JSON.parse(await readFile("commands.json")).commands;
        await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

        console.log('Слеш команды обновлены!');
      } catch (error) {
        console.error(error);
        console.log(commands);
      }

      await interaction.reply("Slash reloaded!")
    break;
  case "invite":
    let nickname = interaction.member.nickname.split("|")
    if (nickname[0].trim().split(" ").length != 3) {
      interaction.reply({content: `Измените своё имя по шаблону: [Звание] [Номер] [Позывной]
      Пример: SPC 0178 Neiro`, ephemeral:true })
      console.log("Invite Command: Ник не подходит по шаблону");
      return
    }
    else{
      let rank = RankStabiliser(nickname[0].trim().split(" ")[0])
      if (!rank) {
        interaction.reply({content:`Невозможно считать ваше звание`, ephemeral:true})
        console.log("Invite Command: Невозможно считать звание "+nickname[0].trim().split(" ")[0]);
        return;
      }

      let modalInvite = new ModalBuilder()
      let modalInfoInvite = ModalMake(modalInvite, "invite", interaction);
      if (modalInfoInvite == false) {
        console.log("Invite Command: Создание модалки невозможно");
        return;
      }
      await interaction.showModal(modalInvite)
      return
    }

	case 'raport':
		let type;
		let maker;

		interaction.options._hoistedOptions.forEach(element => {
			if (element.name == 'type') {
			  type = element
			}
		});


		let modal = new ModalBuilder()
			.setCustomId('Raport Builder')
			.setTitle("Создать рапорт");

    let modalInfo = ModalMake(modal, type.value, interaction);

    

    if (modalInfo == false) {
      console.log("Создание модалки невозможно");
      return;
    }

    await interaction.showModal(modal)

    break;
    case 'auth':
      let user;
      let userid;
      interaction.options._hoistedOptions.forEach(async element => {
        if (element.name == 'user') {
          userid = element.member.user.id;
          user = element.member.nickname.split("|");
          user = user[0].trim().split(" ");
        }
        if (user.length != 4) {
          interaction.reply({content: "Неправильный формат имени", ephemeral:true})
        } else{

          let rank = await RankStabiliser(user[1])

          if (!rank) {
            interaction.reply({content: "Le pizdec, Звания нормальное поставь", ephemeral:true})

            return false
          }

          let userObj = {
            "name" : user[3].at(0).toUpperCase()+user[3].slice(1,).toLowerCase(),
            "guild": user[0].toLowerCase(),
            "rank": rank,
            "id": user[2],
            "user_id": userid
          }
          let usersData = JSON.parse( await readFile("./data/users.json"))
          let userExist = false;
          usersData.users.forEach( async element => {
            if (element.id == userObj.id) {
              interaction.reply({content: "Данный пользователь уже существует", ephemeral:true})
              userExist = true
            }
          })
          if (!userExist) {
            await usersData.users.push(userObj)
            usersData = JSON.stringify(usersData, null, 2);
            writeFile('./data/users.json', usersData, err =>{
              if (err) {
                console.error(err);
              }
            })
            interaction.reply({content:"Пользователь добавлен", ephemeral:true})
          }
        }
      });
    break;
  }

	switch (interaction.customId) {
    case "Raport Builder:" + RAPORT_ID.workout:
      workoutSend(interaction);
      break;
    case "Raport Builder:" + RAPORT_ID.workoutUnited:
      UnitedworkoutSend(interaction);
      break;
    case "Raport Builder:" + RAPORT_ID.simulation:
      SimulationSend(interaction);
      break;
    case "Raport Builder:" + RAPORT_ID.post:
      PostSend(interaction);
      break;
    case "Raport Builder:" + RAPORT_ID.event:
      EventSend(interaction);
      break;
    case "Raport Builder:" + RAPORT_ID.training:
      TrainigSend(interaction);
      break;
    case "RankUp:force":
      console.log("force");
      break;
    case "RankUp:query":
      console.log("query");
    break;
    case "Raport Builder:" + RAPORT_ID.lecture:
      LectureSend(interaction);
      break;
    case "Raport Builder:" + RAPORT_ID.other:
      OtherSend(interaction);
      break;
    case "invite":
      invite(interaction);
      break;
    case "confirm:Officer":
      if (
        interaction.member.roles.cache.some(
          (role) => role.name === "Заместитель командира"
        ) ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Командир"
        ) ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Командование"
        )
      ) {
        console.log("Allow raport:");

        console.log(
          `Allow raport:
        raport name: ` +
            interaction.message.embeds[0].data.title +
            `
        Initiator: ` +
            interaction.member.nickname +
            `
        Fields:
        [
        ` +
            interaction.message.embeds[0].data.fields +
            `
        ]`
        );

        let ConfirmEmbed = new EmbedBuilder()
          .setColor("#E55A36")
          .setTitle(interaction.message.embeds[0].data.title)
          .setAuthor({
            name: interaction.message.embeds[0].data.author.name,
            iconURL: interaction.message.embeds[0].data.author.icon_url,
          })
          .setFooter({ text: "Одобрено: " + interaction.member.nickname });
        interaction.message.embeds[0].data.fields.forEach((field) => {
          ConfirmEmbed.addFields({
            name: field.name == "" ? "\u200B" : field.name,
            value: field.value == "" ? "\u200B" : field.value,
            inline: field.inline,
          });
        });
        interaction.update({ embeds: [ConfirmEmbed], components: [] });
        ConfirmCondition(interaction.message.embeds[0], interaction);
      } else {
        console.log(
          `Access denied: Allow raport,
          user:` +
            interaction.member.nickname +
            `
          raport:
            ID: ` +
            interaction.customId +
            `
            Initiator: ` +
            interaction.member.nickname +
            `
            Fields:
            [
              ` +
            interaction.fields.fields +
            `
            ]`
        );
        interaction.reply({
          content: "Вы не можете одобрять рапорта",
          ephemeral: true,
        });
      }
      break;

    case "cancel:Officer":
      if (
        interaction.member.user.id == interaction.message.interaction.user.id
      ) {
        interaction.message.delete();
        interaction.reply({
          content: "Рапорт удалён",
          embeds: [],
          components: [],
          ephemeral: true,
        });
        console.log(
          `Delete raport:
        raport name: ` +
            interaction.message.embeds[0].data.title +
            `
        Initiator: ` +
            interaction.member.nickname +
            `
        Fields:
        [
        ` +
            interaction.message.embeds[0].data.fields +
            `
        ]`
        );
      } else if (
        interaction.member.roles.cache.some(
          (role) => role.name === "Заместитель командира"
        ) ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Командир"
        ) ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Командование"
        )
      ) {
        let ConfirmEmbed = new EmbedBuilder()
          .setColor("#330101")
          .setTitle(interaction.message.embeds[0].data.title)
          .setAuthor({
            name: interaction.message.embeds[0].data.author.name,
            iconURL: interaction.message.embeds[0].data.author.icon_url,
          })
          .setFooter({ text: "Отклонено: " + interaction.member.nickname });
        interaction.message.embeds[0].data.fields.forEach((field) => {
          ConfirmEmbed.addFields({
            name: field.name,
            value: field.value,
            inline: field.inline,
          });
        });
        interaction.update({ embeds: [ConfirmEmbed], components: [] });

        console.log(
          `Decline raport:
        raport name: ` +
            interaction.message.embeds[0].data.title +
            `
        Initiator: ` +
            interaction.member.nickname +
            `
        Fields:
        [
        ` +
            interaction.message.embeds[0].data.fields +
            `
        ]`
        );
      } else {
        console.log(
          `Access denied: Decline raport,
          user:` +
            interaction.member.nickname +
            `
          raport:
            ID: ` +
            interaction.customId +
            `
            Initiator: ` +
            interaction.member.nickname +
            `
            Fields:
            [
              ` +
            interaction.fields.fields +
            `
            ]`
        );
        interaction.reply({ content: "Вы не можете отклонять рапорта" });
      }
      break;
    case "confirm:invite":
      if (
        interaction.member.roles.cache.some(
          (role) => role.name === "Заместитель командира"
        ) ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Командир"
        ) ||
        interaction.member.roles.cache.some(
          (role) => role.name === "Командование"
        )
      ) {
        let ConfirmEmbed = new EmbedBuilder()
          .setColor("#E55A36")
          .setTitle(interaction.message.embeds[0].data.title)
          .setAuthor({
            name: interaction.message.embeds[0].data.author.name,
            iconURL: interaction.message.embeds[0].data.author.icon_url,
          })
          .setFooter({ text: "Одобрено: " + interaction.member.nickname });
        interaction.message.embeds[0].data.fields.forEach((field) => {
          ConfirmEmbed.addFields({
            name: field.name == "" ? "\u200B" : field.name,
            value: field.value == "" ? "\u200B" : field.value,
            inline: field.inline,
          });
        });
        interaction.update({ embeds: [ConfirmEmbed], components: [] });
      } else {
        interaction.reply({
          content: "Вы не можете одобрять рапорта",
          ephemeral: true,
        });
      }
      break;

    case "rankUpClass":
      let answer = "";

      if (answer == "query") {
      }
      break;
    default:
      break;
  }
}
catch( err ){
  console.log(err);
} 
});

const rest = new REST({ version: '10' }).setToken(TOKEN);


try {
  console.log('Обновление слеш комманд..');

  let commands = JSON.parse(await readFile("commands.json")).commands;
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Слеш команды обновлены!');
} catch (error) {
  console.error(error);
}

client.login(TOKEN);