const db = require('./db')

const dao = {
    getRoomId : async (room) => {
        try{
            const roomResult = await db.query("select * from rooms where name = ?", [room])
            let room_id
            if(roomResult.length === 0){
                //create room1
                const okPacket = await db.query("insert into rooms(name) values(?)", [room])
                room_id = okPacket.insertId
            } else {
                //already room
                room_id = roomResult[0].id
            }
            return room_id
        }
        catch(err){
            throw err
        }
    },
    getUserId : async (sender, room_id) => {
        try{
            const userResult = await db.query("select * from users where name = ? and room_id = ?", [sender, room_id])
            let user_id
            if(userResult.length === 0){
                const okPacket = await db.query('insert into users(name, room_id) values(?, ?)', [sender, room_id])
                user_id = okPacket.insertId 
            } else {
                //already user
                user_id = userResult[0].id
            }        
            return user_id
        } catch(err){
            throw err
        }
    },
    recordChat : async (msg, room_id, user_id) => {
        try{
            db.query("insert into chats(room_id, user_id, msg) values(?, ?, ?)", [room_id, user_id, msg])
        } catch (err){
            throw err
        }
    },
    getChatRankByRoom : async(room_id) => {
        try{
            const rows = await db.query("select name, count(user_id) as count from users left join chats on users.id = chats.user_id where users.room_id = ? group by chats.user_id order by count(user_id) DESC", [room_id])
            return rows
        } catch (err){
            throw err
        }
    }
}

module.exports = dao