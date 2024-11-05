import FindUserByFullName from "./FindUserByFullName.js";
import { readFile, writeFile } from 'fs/promises';

export default async (embed) => {

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

    console.log(orgonizer);
    
    let users = JSON.parse( await readFile("./data/users.json"))

    console.log(users.users[orgonizer.key].condition)

    if (false) {
        
        users.users[orgonizer.key].condition.forEach( element => {
            if (element.name == raportName+":"+raportCode) {
                console.log(element);
            }
        });
    }
}