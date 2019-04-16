const mysql = require('mysql')
const dbConfig = require('./db.secret.config')
const connection = mysql.createConnection({
    host : dbConfig.HOST,
    user : dbConfig.USER,
    password : dbConfig.PASSWORD,
    database : dbConfig.DATABASE,
})

connection.connect()
const db = {
    query : (sql, arr) => {
        return new Promise((resolve, reject) => {
            connection.query(sql, arr, (err, rows, fields) => {
                if(err) { return reject(err) }
                resolve(rows)
            })
        })
    }
}

module.exports = db