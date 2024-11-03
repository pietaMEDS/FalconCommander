import { error, log } from 'console';
import { env } from 'process';
// const wait = require('node:timers/promises').setTimeout;
// import { wait } from "node:timers/promises"
import { setTimeout } from 'node:timers/promises'
import { ActionRowBuilder, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { Client, GatewayIntentBits } from 'discord.js';
import { readFile, writeFile } from 'fs/promises';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import 'dotenv/config'


const RAPORT_ID =  JSON.parse(process.env.RAPORT_ID)
const creds = process.env.GOOGLE_CRED
const TOKEN = process.env.TOKEN
const CLIENT_ID = process.env.CLIENT_ID;
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
import { exec } from 'child_process';
import ModalMake from './modals/workout.js';
import workoutSend from './commands/raportSend/workout.js';
import SimulationSend from './commands/raportSend/simulation.js';
import PostSend from './commands/raportSend/post.js';
import EventSend from './commands/raportSend/event.js';

client.on('ready', () => {
  console.log(`Вход выполнен как ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  try{
//   if (interaction.isChatInputCommand()) return;
  let message;

  switch (interaction.commandName) {
    case 'connect':
      let DocID;
      try {
        interaction.options._hoistedOptions.forEach(element => {
          if (element.name == 'sheet-id') {
            console.log(`Founded value: ${element.value}`);
            DocID = element.value;
          }
        });
        const jwt = new JWT({
          email: creds.client_email,
          key: creds.private_key,
          scopes: SCOPES,
        });
        const doc = new GoogleSpreadsheet(DocID, jwt);
  
        await doc.loadInfo();
        console.log(doc.title);
        message = `${doc.title} sheet loaded!`;
        interaction.reply({content:message, fetchReply:true})
        .then((message) => console.log(`Send "${message}" to ${interaction.member.displayName} on Guild:[${interaction.guildId}] Channel:[${interaction.channelId}]`))
        .catch(console.error);
      } catch (error) {
        interaction.reply("Something went wrong.");
        console.log(error);
      }
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
      interaction.options._hoistedOptions.forEach(async element => {
        if (element.name == 'user') {
          user = element.member.nick.split("|")
          user = user[0].trim().split(" ")
        }
        if (user.length != 4) {
          interaction.reply({content: "Неправильный формат имени", ephemeral:true})
        } else{

          async function RankStabiliser( rank ){
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
            return rankJson
          }

          let rank = await RankStabiliser(user[1])
          console.log(rank);

          if (rank == '') {
            interaction.reply({content: "Le pizdec, Звания нормальное поставь", ephemeral:true})
            return false
          }

          let userObj = {
            "name" : user[3].at(0).toUpperCase()+user[3].slice(1,).toLowerCase(),
            "guild": user[0].toLowerCase(),
            "rank": rank,
            "id": user[2],
          }
          let usersData = JSON.parse( await readFile("./data/users.json"))
          let userExist = false;
          usersData.users.forEach( async element => {
            if (element.id == userObj.id) {
              interaction.reply({content: "Данный пользователь уже существует", ephemeral:true})
              userExist = true
            }
          })
          console.log(userExist);
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
		case "Raport Builder:"+RAPORT_ID.workout:
      workoutSend(interaction)
		break;
    case "Raport Builder:"+RAPORT_ID.simulation:
      SimulationSend(interaction)
    break;
    case "Raport Builder:"+RAPORT_ID.post:
      PostSend(interaction)
    break;
    case "Raport Builder:"+RAPORT_ID.event:
      EventSend(interaction)
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
  console.log(commands);
  await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });

  console.log('Слеш команды обновлены!');
} catch (error) {
  console.error(error);
}

client.login(TOKEN);