import FindUserByFullName from "./FindUserByFullName.js";
import { readFile, writeFile } from 'fs/promises';

export default async (embed) => {

    try {
        let raportName;
        let raportCode;

        switch (embed.data.title) {
            case "*Рапорт о проведении тренировки*":
                raportName = "workout"
                raportCode = "1233859013284991118"
                break;
            default:
                break;
        }

        let orgonizer = await FindUserByFullName(embed.data.author.name.split(":")[1])
        
        let users = JSON.parse( await readFile("./data/users.json"))

        if (raportCode) {
            users.users[orgonizer.key].rank.condition.forEach( (element, key) => {
                if (element.name == "orgonize:"+raportCode) {
                    if (element.value > 0) {
                        users.users[orgonizer.key].rank.condition[key].value--
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
        members.forEach(async member =>{
            let memberObj = member.split("-")[1].trim();
            memberObj = await FindUserByFullName(memberObj)
        })


    } catch (error) {
        console.log(error);
    }
}