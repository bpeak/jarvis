const jarvis = require('./jarvisLauncher')()
let time

const msgResponser = async (msg, sender) => {

    console.log(msg, sender)

    if(jarvis.store.getState().isUsing){
        clearTimeout(time)
        time = setTimeout(() => {
            jarvis.store.initState()
        }, jarvis.config.timeoutMS)
        if(jarvis.store.getState().owner === sender || sender === '김기현'){
            return await jarvis.commandExcuter(msg, sender)
        } else {
            console.log("Jarvis is currently in use")
        }
    }

    if(jarvis.processor.isCallJarvis(msg)){
        jarvis.store.updateState({
            ...jarvis.store.getState(),
            isUsing : true,
            owner : sender,
        })
        time = setTimeout(() => {
            jarvis.store.initState()
        }, jarvis.config.timeoutMS);
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
}

module.exports = msgResponser