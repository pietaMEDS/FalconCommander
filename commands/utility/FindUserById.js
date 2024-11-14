import { readFile, writeFile } from 'fs/promises';

export default async (id) => {
    let users = JSON.parse( await readFile("./data/users.json"))

    let findedUser;

    users.users.forEach(user => {
        if (user.user_id == id) {
            findedUser = user;
        }
    });
    if (findedUser) {
        return findedUser;
    }

    return false
}