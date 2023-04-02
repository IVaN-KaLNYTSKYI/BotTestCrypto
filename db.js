const mysql = require('mysql2/promise');
const config = require('./helper/config')
const pool = mysql.createPool(config.dbConfig);

module.exports={
    pool
}
