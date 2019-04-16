const db = require('./db')

const getRoomId = async (room) => {
    try{
        const roomResult = await db.query("select * from rooms where name = ?", [room])
        let room_id
        if(roomResult.length === 0){
            //create room
            console.log(1)
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
}

module.exports = getRoomId