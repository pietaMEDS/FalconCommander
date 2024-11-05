import { readFile, writeFile } from 'fs/promises';

export default async (FullName) => {
    let users = JSON.parse( await readFile("./data/users.json"))

    let findedUser;
    let findedKey;

    let userArr = FullName.trim().split("|")
    userArr = userArr[0].split(" ")
    let userObj = {
        guild: userArr[0].trim().toLowerCase(),
        rank: userArr[1].trim().toLowerCase(),
        id: userArr[2].trim().toLowerCase(),
        name: userArr[3].trim().toLowerCase(),
    }
    users.users.forEach((user, key) => {
        if (user.id == userObj.id) {
            findedUser = user;
            findedKey = key
        }
    });
    findedUser.key = findedKey
    return findedUser;
}