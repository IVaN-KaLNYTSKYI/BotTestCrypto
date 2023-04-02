const {pool} = require('../db')
async function listUsers() {
    try {
        let [rows] = await pool.query(
            'SELECT * FROM user.users'
        );
        return rows
    }
    catch (e) {
        console.error(e);
    }
}
async function creatUser(name, chat_id,email, password) {
    try {
        let [rows] = await pool.query(
            "INSERT INTO user.users (name, chat_id,email, password) VALUES (?, ?,?,?)",
            [name, chat_id,email, password]
        );
        return rows[0]
    }
    catch (e) {
        console.error(e);
    }
}

async function findUser(chat_id) {
    console.log(chat_id);
    try {
        let [rows] = await pool.query(
            ` SELECT *
                  FROM user.users
                  WHERE chat_id='${chat_id}'`,
            []
        );
        return rows[0]
    }
    catch (e) {
        console.error(e);
    }
}
module.exports={
    listUsers,
    creatUser,
    findUser
}
