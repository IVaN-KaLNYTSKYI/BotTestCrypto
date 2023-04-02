const {pool} = require('../db')

async function findCrypto(nikCrypto) {
    try {
        let [rows] = await pool.query(
            ` SELECT *
                  FROM user.crypto
                  WHERE nikCrypto='${nikCrypto}'`,
            []
        );
        return rows[0]
    }
    catch (e) {
        console.error(e);
    }
}

async function creatCrypto(current,nikCrypto) {
    try {
        let [rows] = await pool.query(
            `INSERT INTO user.crypto (current , nikCrypto) VALUES (?, ?)
                 ON DUPLICATE KEY update current = ${current}`,
            [current,nikCrypto]
        );
        return rows[0]
    }
    catch (e) {
        console.error(e);
    }
}

module.exports={
    findCrypto,
    creatCrypto
}
