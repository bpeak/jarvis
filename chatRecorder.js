const db = require('./db')

const chatRecorder = async(msg, sender) => {
    try{
        const rows = await db.query("select * from users where name = ?", [sender])
        let user_id
        if(rows.length === 0){
            okPacket = await db.query("insert into users(name) values(?)", [sender])
            user_id = okPacket.insertId
        } else {
            user_id = rows[0].id
        }
    
        await db.query("insert into chatcounts(user_id) values(?)", [user_id])    
    } catch (err) {
        console.log(err)
    }
}

module.exports = chatRecorder