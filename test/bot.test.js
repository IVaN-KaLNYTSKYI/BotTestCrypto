const config = require('../helper/config')

const mysql = require('mysql2/promise');
const pool = mysql.createPool(config.dbConfig);

describe('DB tests', () => {
   let currentCrypto=11;
   let userTest={
       name:'test',
       chat_id:111111,
       email:'test@gmail.com',
       password:'12335412245',
   }

    afterAll(() => {
        pool.end();
    });
    it('CREATE USER', async () => {
        let data
            try {
                let [rows] = await pool.query(
                    "INSERT INTO user.users (name, chat_id,email, password) VALUES ('test', 111111,'test@gmail.com','12335412245') "
                );
                data='successfully'
            }
            catch (e) {
                data='no successfully'
                console.error(e);
            }

        expect(data).toBe("successfully");
    });
    it('FIND USER by chat_id', async () => {
        let user
        try {
            let [rows] = await pool.query(
                'SELECT name, chat_id,email, password FROM user.users WHERE chat_id=111111'
            );
            user=rows[0]
        }
        catch (e) {
            console.error(e);
        }
        console.log(user);

        expect(user).toStrictEqual(userTest);
    });

    it('CREATE CURRENT CRYPTO', async () => {
        let data
        try {
            let [rows] = await pool.query(
                `INSERT INTO user.crypto (current , nikCrypto) VALUES (?, ?)
                 ON DUPLICATE KEY update current = ${currentCrypto}`,
                [currentCrypto,'BTC']
            );
            console.log(rows);
            data='successfully'
        }
        catch (e) {
            data='no successfully'
            console.error(e);
        }

        expect(data).toBe('successfully');
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
