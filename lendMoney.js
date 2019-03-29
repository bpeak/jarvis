const db = require('./db')

const lendMoney = async (giver_name, won, taker_name) => {
    let giver_id
    let taker_id
    const giverRows = await db.query("select id from users where name = ?", [giver_name])
    if(giverRows.length === 0){
        const OkPacket = await db.query("insert into users(name) values(?)", [giver_name])
        giver_id = OkPacket.insertId
    } else {
        giver_id = giverRows[0].id
    }
    const takerRows = await db.query("select id from users where name = ?", [taker_name])
    if(takerRows.length === 0){
        const OkPacket = await db.query("insert into users(name) values(?)", [taker_name])
        taker_id = OkPacket.insertId
    } else {
        taker_id = takerRows[0].id
    }

    db.query("select * from transactions")

    db.query("insert into transactions(giver_id, won, taker_id) values(?, ?, ?)", [giver_id, won, taker_id])
}

module.exports = lendMoney