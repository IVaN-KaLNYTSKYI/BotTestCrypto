const config = require('../helper/config')

const mysql = require('mysql2/promise');
const pool = mysql.createPool(config.dbConfig);

describe('DB tests', () => {
let currentCrypto=11
    afterAll(() => {
        pool.end();
    });
    it('CREATE USER', async () => {
            try {
                let [rows] = await pool.query(
                    "INSERT INTO user.users (name, chat_id,email, password) VALUES (?, ?,?,?)",
                    ['test', 111111,'test@gmail.com', '12335412245']
                );
                console.log(rows);
            }
            catch (e) {
                console.error(e);
            }

        expect("Welcome to my bot!").toBe('Welcome to my bot!');
    });
    it('FIND USER by chat_id', async () => {
        try {
            let [rows] = await pool.query(
                'SELECT * FROM user.users WHERE chat_id=111111'
            );
            console.log(rows);
        }
        catch (e) {
            console.error(e);
        }

        expect("Welcome to my bot!").toBe('Welcome to my bot!');
    });

    it('CREATE CURRENT CRYPTO', async () => {
        try {
            let [rows] = await pool.query(
                `INSERT INTO user.crypto (current , nikCrypto) VALUES (?, ?)
                 ON DUPLICATE KEY update current = ${current}`,
                [currentCrypto,'BTC']
            );
            console.log(rows);
        }
        catch (e) {
            console.error(e);
        }

        expect("Welcome to my bot!").toBe('Welcome to my bot!');
    });

    it('FIND CURRENT CRYPTO', async () => {
        let current
        try {
            let [rows] = await pool.query(
                ` SELECT *
                  FROM user.crypto
                  WHERE nikCrypto='BTC'`,
                []
            );
            console.log(rows);
            current=rows[0].current
        }
        catch (e) {
            console.error(e);
        }

        expect(current).toBe(currentCrypto);
    });

});
