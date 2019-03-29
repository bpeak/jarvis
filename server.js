const express = require('express')
const app = express()
const PORT = 80
const path = require('path')
const chatRecorder = require('./chatRecorder')
const msgResponser = require('./msgResponser')
const renderHTML = require('./renderHTML')


// const lendMoney = require('./lendMoney')
// lendMoney("김기현똘료리", 30000, "김종민딸로리")

const getChatRank = require('./getChatRank')()
.then(res => console.log(res))

app.use('/public', express.static(path.join(__dirname, 'public')))
app.get('/', async(req, res) => {
    console.log("--request in--")
    const { msg, sender } = req.query
    if(
        msg  === undefined ||
        msg === null ||
        typeof msg !== 'string' ||
        sender === undefined ||
        sender === null ||
        typeof sender !== 'string'
    ){
        return renderHTML(res, null)
    }

    const result = await msgResponser(msg, sender)
    renderHTML(res, result)
    chatRecorder(msg, sender)
})

app.listen(PORT, () => {
    console.log(`listen on port ${PORT}`)
})
