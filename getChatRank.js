const db = require('./db')

const getChatRank = () => db.query("select name, count(user_id) as count from users left join chatcounts on users.id = chatcounts.user_id group by chatcounts.user_id order by count(user_id) DESC")
module.exports = getChatRank