const express = require('express')
const app = express()
const PORT = 4000
const path = require('path')
const chatRecorder = require('./chatRecorder')
const msgResponser = require('./msgResponser')
const renderHTML = require('./renderHTML')
const getRoomId = require('./getRoomId')
const dao = require('./dao')

const db = require('./db')

// const getChatRank = (room_id) => {
//     db.query("select name, count(user_id) as count from users left join chats on users.id = chats.user_id where users.room_id = ? group by chats.user_id order by count(user_id) DESC", [room_id])
//     .then(res => console.log(res))
// }

// getChatRank(14)


// //room check
// const a = async (msg, sender, room) => {
//     try{
//         //room check
//         const roomResult = await db.query("select * from rooms where name = ?", [room])
//         let room_id
//         if(roomResult.length === 0){
//             //create room
//             console.log(1)
//             const okPacket = await db.query("insert into rooms(name) values(?)", [room])
//             room_id = okPacket.insertId
//         } else {
//             //already room
//             room_id = roomResult[0].id
//         }
//         console.log("룸아이디 : ", room_id)
//         //user check
//         const userResult = await db.query("select * from users where name = ? and room_id = ?", [sender, room_id])
//         let user_id
//         if(userResult.length === 0){
//             const okPacket = await db.query('insert into users(name, room_id) values(?, ?)', [sender, room_id])
//             user_id = okPacket.insertId 
//         } else {
//             //already user
//             user_id = userResult[0].id
//         }
//         db.query("insert into chats(room_id, user_id, msg) values(?, ?, ?)", [room_id, user_id, msg])
//     }
//     catch(err){
//         console.log(err)
//     }
// }

// a(msg, sender, room)



// const lendMoney = require('./lendMoney')
// lendMoney("김기현똘료리", 30000, "김종민딸로리")

// const getchatRank = require('./getchatRank')()
// .then(res => console.log(res))

// const db = require('./db')
// db.query("select * from users", )

app.use('/public', express.static(path.join(__dirname, 'public')))
app.get('/', async(req, res) => {
    try{
        const { msg, sender, room } = req.query
        if(
            msg  === undefined ||
            msg === null ||
            typeof msg !== 'string' ||
            sender === undefined ||
            sender === null ||
            typeof sender !== 'string' ||
            sender === undefined ||
            sender === null ||
            typeof sender !== 'string'
        ){
            return renderHTML(res, null)
        }
    
        const room_id = await dao.getRoomId(room)
        const user_id = await dao.getUserId(sender, room_id)
        const user = {
            name : sender,
            id : user_id,
        }
        const result = await msgResponser(msg, room_id, user)
        renderHTML(res, result)
        dao.recordChat(msg, room_id, user_id)
    }catch(err){
        console.log(err)
    }
})

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
})
