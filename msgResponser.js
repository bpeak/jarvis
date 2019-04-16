const jarvisLauncher = require('./jarvisLauncher')
const jarvisRooms = {

}

const msgResponser = async (msg, room_id, user) => {

    let jarvis

    try{
        if(jarvisRooms[room_id] === undefined){ jarvisRooms[room_id] = jarvisLauncher() }
        jarvis = jarvisRooms[room_id]
    
        if(jarvis.store.getState().isUsing){
            jarvis.store.clearTimer()
            jarvis.store.setTimer(setTimeout(() => {
                jarvis.store.initState()
            }, jarvis.config.timeoutMS))
            if(jarvis.store.getState().owner === user.id || user.name === '김기현'){
                return await jarvis.commandExcuter(msg, user, room_id)
            } else {
                console.log("Jarvis is currently in use")
                return ({
                    isHaveResponse : false,
                    response : false,
                })
            }
        }
    
        if(jarvis.processor.isCallJarvis(msg)){
            jarvis.store.updateState({
                ...jarvis.store.getState(),
                isUsing : true,
                owner : user.id,
            })
            jarvis.store.setTimer(setTimeout(() => {
                jarvis.store.initState()
            }, jarvis.config.timeoutMS))
            return ({
                isHaveResponse : true,
                response : `
[ SYSTEM - ON ]
    
부르셨나요
( 명령어를 모르시면 도움말 이라고 입력해주세요. )
`
            })
        }
        
        console.log("javis is sleeping")
        return ({
            isHaveResponse : false,
            response : false
        })    
    } catch ( err ) {
        console.log(err)
        jarvis.store.initState()
        return ({
            isHaveResponse : true,
            response : 
`
예상하지 못한 에러가 발생했어요.
자비스를 종료합니다.
`
        })
    }

    
}

module.exports = msgResponser