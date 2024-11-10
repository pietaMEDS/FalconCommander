import post from "../raportSend/post.js";
import FindUserByFullName from "./FindUserByFullName.js";
import { readFile, writeFile } from 'fs/promises';

export default async (embed, interaction) => {

    try {
        let raportName;
        let raportCode;

        switch (embed.data.title) {
            case "*Рапорт о проведении тренировки*":
                raportName = "workout"
                raportCode = "1233859013284991118"
            break;

            case "*Рапорт о Боевом вылете*":
                raportName = "event"
                raportCode = "1233859013284991118"
            break;

            case "*Рапорт о проведении совместной тренировки*":
                raportName = "workout"
                raportCode = "1233859013284991118United"
            break;

            case "*Рапорт о Постовой/Патрульной Службе*":
                raportName = "post"
                raportCode = "1233857616413851758"
            break;

            case "*Рапорт о проведении лекции*":
                raportName = "lecture"
                raportCode = "1233862206521872486"
            break;

            case "*Рапорт о проведении Иного типа занятий*":
                interaction.reply({ content:"Критерии данного типа не могут быть расспределены", ephemeral: true})
                return
            break;

            case "*Рапорт о проведении симуляции*":
                raportName = "simulation"
                raportCode = "1233859972274851932"
            break;

            case "*Рапорт о проведении обучения*":
                raportCode = "1233867252206407823"
            break;

            default:
                console.log("Неизвестный случай изменения критериев: "+ embed.data.title);  
                return  
            break;
        }

        let orgonizer = await FindUserByFullName(embed.data.author.name.split(":")[1])
        
        let users = JSON.parse( await readFile("./data/users.json"))

        if (raportCode) {
            users.users[orgonizer.key].rank.condition.forEach( async (element, key) => {
                if (element.name == "orgonize:"+raportCode) {
                    if (element.value > 0) {
                        if (raportName == "post") {
                            let posttime = embed.data.fields[1].value.split(" ")[0].trim()
                            users.users[orgonizer.key].rank.condition[key].value-=posttime
                        }else{
                            users.users[orgonizer.key].rank.condition[key].value--
                        }
                        await writeFile('./data/users.json', JSON.stringify(users, null, 2), err =>{
                            if (err) {
                                console.error(err);
                            }
                        })
                    }
                }
            });
        }

        let members;
        embed.data.fields.forEach( field => {
            if (field.name == "Участники") {
                members = field.value
            }
        })

        members = members.split(`
`)

        if (raportName) {
            members.forEach(async member =>{
                let memberObj = member.split("-")[1].trim();
                memberObj = await FindUserByFullName(memberObj)
                if (!memberObj==false) {
                    users.users[memberObj.key].rank.condition.forEach( async (element, key) => {
                        if (element.name == raportName) {
                            console.log(raportName);
                            if (element.value > 0) {
                                if (raportName == "post") {
                                    let posttime = embed.data.fields[1].value.split(" ")[0].trim()
                                    users.users[memberObj.key].rank.condition[key].value-=posttime
                                }else{
                                    console.log(users.users[memberObj.key].rank.condition[key]);
                                    users.users[memberObj.key].rank.condition[key].value--
                                    console.log(users.users[memberObj.key].rank.condition[key]);
                                }
                                await writeFile('./data/users.json', JSON.stringify(users, null, 2), err =>{
                                    if (err) {
                                        console.error(err);
                                    }
                                })
                            }
                        }
                    })
                }
            })
        }
       

    } catch (error) {
        console.log(error);
    }
}