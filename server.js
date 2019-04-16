const express = require('express')
const app = express()
const PORT = 4000
const path = require('path')
const msgResponser = require('./msgResponser')
const renderHTML = require('./renderHTML')
const dao = require('./db/dao')

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
