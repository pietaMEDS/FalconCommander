import { ActionRowBuilder, Component, ModalBuilder, REST, Routes, TextInputBuilder, TextInputStyle  } from 'discord.js';
import { env } from 'process';
import 'dotenv/config'
const RAPORT_ID =  JSON.parse(process.env.RAPORT_ID)

export default (modal, id, interaction) => {

	let soldiers;
	let description;

	switch (id) {
		case RAPORT_ID.workout:
		
			modal.setTitle("Рапорт о проведении тренировки")
			modal.setCustomId('Raport Builder:'+id)
		
			let workoutName = new TextInputBuilder()
				.setCustomId("workoutName")
				.setLabel("Название проводимой тренировки")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)
		
			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа. (позывные через запятую)")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)
		
			description = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Информация о тренировке")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)
		
				let RowworkoutName = new ActionRowBuilder().addComponents(workoutName);
				let Rowsoldiers = new ActionRowBuilder().addComponents(soldiers);
				let Rowdescription = new ActionRowBuilder().addComponents(description);
		
			modal.addComponents(RowworkoutName, Rowdescription, Rowsoldiers)	
			break;

			case RAPORT_ID.workoutUnited:
		
			modal.setTitle("Рапорт о проведении совместной тренировки")
			modal.setCustomId('Raport Builder:'+id)
		
			let UniworkoutName = new TextInputBuilder()
				.setCustomId("workoutName")
				.setLabel("Название проводимой совместной тренировки")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)
		
			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа.")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)
		
			description = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Информация о тренировке")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)
		
				let RowUniworkoutName = new ActionRowBuilder().addComponents(UniworkoutName);
				let RowUnisoldiers = new ActionRowBuilder().addComponents(soldiers);
				let RowUnidescription = new ActionRowBuilder().addComponents(description);
		
			modal.addComponents(RowUniworkoutName, RowUnisoldiers, RowUnidescription)

			break;
		case RAPORT_ID.simulation:
			modal.setTitle("Рапорт о проведении симуляции")
			modal.setCustomId('Raport Builder:'+id)
		
			let dificult = new TextInputBuilder()
				.setCustomId("dificult")
				.setLabel("Выбранная сложность")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)
		
			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа. (позывные через запятую)")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)

			let result = new TextInputBuilder()
				.setCustomId("result")
				.setLabel("Результат симуляции")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)

		
			let RowDificult = new ActionRowBuilder().addComponents(dificult);
			let RowSoldiers = new ActionRowBuilder().addComponents(soldiers);
			let RowResult = new ActionRowBuilder().addComponents(result);
		
			modal.addComponents(RowDificult, RowResult, RowSoldiers)
			break;

		case RAPORT_ID.post:
			modal.setTitle("Рапорт о Постовой/Патрульной Службе")
			modal.setCustomId('Raport Builder:'+id)
		
			let duration = new TextInputBuilder()
				.setCustomId("duration")
				.setLabel("Длительность Поста/Патруля (10 мин)")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)
		
			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа. (позывные через запятую)")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)

			let Sector = new TextInputBuilder()
				.setCustomId("sector")
				.setLabel("Сектор Поста/Патруля")
				.setStyle(TextInputStyle.Short)
				.setRequired(true)
		
			description = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Дополнительная информация")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true)
		
			let firstRowPost = new ActionRowBuilder().addComponents(Sector);
			let secondRowPost = new ActionRowBuilder().addComponents(duration)
			let thirdRowPost = new ActionRowBuilder().addComponents(soldiers)
		
			modal.addComponents(firstRowPost, secondRowPost, thirdRowPost)
		break;

		case RAPORT_ID.event:
			modal.setTitle("Рапорт об участии в боевом вылете")
			modal.setCustomId('Raport Builder:'+id)

			
			let operation = new TextInputBuilder()
				.setCustomId("operation")
				.setLabel("Название операции")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа. (позывные через запятую)")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);
		
			description = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Информация по операции")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);
		

			let firstRowEvent = new ActionRowBuilder().addComponents(operation)
			let secondRowEvent = new ActionRowBuilder().addComponents(description)
			let thirdRowEvent = new ActionRowBuilder().addComponents(soldiers)
		
			modal.addComponents(firstRowEvent, secondRowEvent, thirdRowEvent)
		break;

		case RAPORT_ID.lecture:
			modal.setTitle("Рапорт о проведении лекции")
			modal.setCustomId('Raport Builder:'+id)

			
			let lecture = new TextInputBuilder()
				.setCustomId("lecture")
				.setLabel("Название лекции")
				.setStyle(TextInputStyle.Short)
				.setRequired(true); 

			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа. (позывные через запятую)")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);
		
			let firstRowLecture = new ActionRowBuilder().addComponents(lecture)
			let secondRowLecture = new ActionRowBuilder().addComponents(soldiers)
		
			modal.addComponents(firstRowLecture, secondRowLecture)
		break;


		case RAPORT_ID.training:
			modal.setTitle("Рапорт о проведении обучения")
			modal.setCustomId('Raport Builder:'+id)

			
			let Specialisation = new TextInputBuilder()
				.setCustomId("spec")
				.setLabel("Название специализации")
				.setStyle(TextInputStyle.Short)
				.setRequired(true); 

			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа. Если 212 то позывные, иначе полностью")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);

			let trainResult = new TextInputBuilder()
				.setCustomId("result")
				.setLabel("Результат (через запятую)")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);
		
			let firstRowTraining = new ActionRowBuilder().addComponents(Specialisation)
			let secondRowTraining = new ActionRowBuilder().addComponents(soldiers)
			let thirdRowTraining = new ActionRowBuilder().addComponents(trainResult)
		
			modal.addComponents(firstRowTraining, secondRowTraining, thirdRowTraining)
		break;

		case "invite":
			modal.setTitle("Заявка на встепление")
			modal.setCustomId('invite')

			
			let InviteSteamId = new TextInputBuilder()
				.setCustomId("SteamId")
				.setLabel("SteamID игрового аккаунта")
				.setStyle(TextInputStyle.Short)
				.setRequired(true); 

			let Invitetime = new TextInputBuilder()
				.setCustomId("WorldHour")
				.setLabel("Часовой пояс")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			let Invitedesc = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Дополнительная информация")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);
		
			let firstRowInvite = new ActionRowBuilder().addComponents(InviteSteamId)
			let secondRowInvite = new ActionRowBuilder().addComponents(Invitetime)
			let thirdRowInvite = new ActionRowBuilder().addComponents(Invitedesc)
		
			modal.addComponents(firstRowInvite, secondRowInvite, thirdRowInvite)
		break;

		case RAPORT_ID.other:
			modal.setTitle("Прочие")
			modal.setCustomId('Raport Builder:'+id)

			
			let RaportTheme = new TextInputBuilder()
				.setCustomId("Theme")
				.setLabel("Тема рапорта")
				.setStyle(TextInputStyle.Short)
				.setRequired(true); 

			let RaportBody = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Описание")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);

				soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Группа")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(true);
		
			let firstRowOther = new ActionRowBuilder().addComponents(RaportTheme)
			let secondRowOther = new ActionRowBuilder().addComponents(RaportBody)
			let thirdRowOther = new ActionRowBuilder().addComponents(soldiers)
		
			modal.addComponents(firstRowOther, secondRowOther, thirdRowOther)
		break;

		case "rankUpClass":

			if (rankUp.type == "query") {
				modal.setTitle("Очередное повышение");
				modal.setCustomId("RankUp:query");
			}
			else if(rankUp.type == "force"){
				modal.setTitle("Внеочередное повышение");
        		modal.setCustomId("RankUp:force");
			}
			else{
				interaction.reply({
					content: "Произошла внутреняя ошибка, Неизвестный случай повышения",
					ephemeral: true,
				});
				console.error("Неизвестный случай повышения");
				return;
			}

			soldiers = new TextInputBuilder()
				.setCustomId("soldiers")
				.setLabel("Боец")
				.setStyle(TextInputStyle.Short)
				.setRequired(true);

			let RaportReason = new TextInputBuilder()
				.setCustomId("desc")
				.setLabel("Своя причина если имеется")
				.setStyle(TextInputStyle.Paragraph)
				.setRequired(false);

			let firstRowRankUp = new ActionRowBuilder().addComponents(soldiers);
			let secondRowRankUp = new ActionRowBuilder().addComponents(RaportReason);
			modal.addComponents(firstRowRankUp, secondRowRankUp);
		break;
		
		default:
			interaction.reply({content: "В данный момент недоступно", ephemeral:true})
			setTimeout(() => {
				interaction.deleteReply()
			},6000) 	
			return false;
		break;
	}
}