const db = require('./db')

const getchatRank = () => db.query("select name, count(user_id) as count from users left join chats on users.id = chats.user_id group by chats.user_id order by count(user_id) DESC")
module.exports = getchatRank