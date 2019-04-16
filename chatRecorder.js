const db = require('./db')

const chatsRecorder = async(msg, sender) => {
    try{
        const rows = await db.query("select * from users where name = ?", [sender])
        let user_id
        if(rows.length === 0){
            okPacket = await db.query("insert into users(name) values(?)", [sender])
            user_id = okPacket.insertId
        } else {
            user_id = rows[0].id
        }
    
        await db.query("insert into chats(user_id, description) values(?, ?)", [user_id, msg])    
    } catch (err) {
        console.log(err)
    }
}

module.exports = chatsRecorder