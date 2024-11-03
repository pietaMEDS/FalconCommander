import { readFile, writeFile } from 'fs/promises';

export default async (interaction) => {

    console.log(interaction.member.user.id);


    // let users = JSON.parse( await readFile("./data/users.json"))
    // let memberarray = interaction.member.nickname.split(" ")

    // let member = {
    //     guild: memberarray[0].trim().toLowerCase(),
    //     rank: memberarray[1].trim().toLowerCase(),
    //     id: memberarray[2].trim().toLowerCase(),
    //     name: memberarray[3].trim().toLowerCase()
    // }

    // console.log(interaction.member);
    

//     users.users.forEach(element => {
//         if (
            
//         ) {
            
//         } else {
            
//         }
//     });
}