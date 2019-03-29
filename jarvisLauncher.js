const getChatRank = require('./getChatRank')
const getLuck = require('./getLuck')

const jarvisLauncher = () => {
    const config = {
        timeoutMS : 1000 * 30
    }
    
    const defaultState = {
        isUsing : false,
        owner : null,
        currentDepth : 0,
        currentSubject : null,
        isListening : false,
    }
    const store = (() => {
        let state = {...defaultState}
        const getState = () => Object.assign({} , state)
        const initState = () => { state = {...defaultState} }
        const updateState = (newState) => { state = {...newState} }

        return ({
            getState,
            initState,
            updateState,
        })
    })()

    const processor = {
        isCallJarvis : (msg) => msg.substring(0, 4) === '자비스'
    }

    const notFoundCmd = () => {
        return ({
            isHaveResponse : false,
            response : false,
        })
    }

    const jarvisCommands = [
        //depth 0
        {
            '프리' : () => {
                store.initState()
                return ({
                    isHaveResponse : true,
                    response : "자비스는 자유의 몸이에요..."
                })
            },
            '리셋' : () => {
                store.updateState({
                    ...defaultState,
                    owner : store.getState().owner,
                    isUsing : true,
                })
                return ({
                    isHaveResponse : true,
                    response : "< 원하시는 처리를 말씀해주세요 >"
                })
            },
//             '돈계산' : () => {
//                 store.updateState({
//                     ...store.getState(),
//                     currentDepth : store.getState().currentDepth + 1,
//                     currentSubject : '돈계산',
//                 })                
//                 return ({
//                     isHaveResponse : true,
//                     response : 
// `
// 돈빌려주기
// 돈갚기
// 채무내역
// `
//                 })
//             },
            '채팅순위' : async () => {
                const rows = await getChatRank()
                let response = "채팅순위\n"
                for(let i = 0; i < rows.length; i++){
                    response += `${i + 1}위 ${rows[i].name}   ${rows[i].count}회\n`
                }
                return ({
                    isHaveResponse : true,
                    response,
                })
            },
            '오늘의운세' : async () => {
                store.updateState({
                    ...store.getState(),
                    isListening : true,
                    listenEvent : async (msg, sender) => {
                        let isAllNumber = true
                        for(let i = 0; i < msg.length; i++){
                            if(Number(msg[i]) === NaN){
                                isAllNumber = false
                                break;
                            }
                        }
                        if(!isAllNumber && msg.length !== 8){
                            return ({
                                isHaveResponse : true,
                                response : "잘못된 입력입니다. EX) 19940402"
                            })
                        }
                        const luck = await getLuck(msg)
                        let response = sender + "님의 " + luck.name + "\n\n"
                        response += luck.keyword + "\n\n"
                        response += luck.desc
                        return ({
                            isHaveResponse : true,
                            response,
                        })
                    }
                })                
                return ({
                    isHaveResponse : true,
                    response : 
`
생년월일을 입력해주세요
EX)
19930402
`
                })
            },
            '도움말' : () => {
                return ({
                    isHaveResponse : true,
                    response :
`
< 원하시는 처리를 말씀해주세요 >
채팅순위
오늘의운세
리셋
종료
`                                        
                })
            },
            '종료' : () => {
                store.initState()
                return ({
                    isHaveResponse : true,
                    response : 
`
[ SYSTEM - OFF ]

자비스를 종료합니다.
`
                })
            }
        },

        //depth 1
        {
            '돈계산' : {
                '돈빌려주기' : () => {
                    store.updateState({
                        ...store.getState(),
                        isListening : true,
                        listenEvent : async (msg) => {
                            const arr = msg.split(" ")
                            const charge = Number(arr[0])
                            let response = `${charge}원을\n`
                            arr.shift()
                            const giver = arr[0]
                            const taker = arr[arr.length - 1]
                            response += `[ ${giver} ]이 [ ${taker} ]에게 빌려줍니다\n맞으면 1 틀리면 2`
                            store.updateState({
                                ...store.getState(),
                                isListening : true,
                                listenEvent : async (msg) => {
                                    if(msg === "1"){
                                        store.initState()
                                        return ({
                                            isHaveResponse : true,
                                            response : "처리완료."
                                        })
                                    } else if(msg === "2"){
                                        store.initState()
                                        return ({
                                            isHaveResponse : true,
                                            response : "취소되었습니다."
                                        })
                                    } else {
                                        return ({
                                            isHaveResponse : true,
                                            response : "메시지를 이해하지 못했어요."
                                        })
                                    }
                                }
                            })
                            return ({
                                isHaveResponse : true,
                                response,
                            })
                        }
                    })
                    return ({
                        isHaveResponse : true,
                        response : 
`
[금액] [빌려주는사람] [빌리는사람] 순으로 입력해주세요.
EX)
30000 김기현 김명식
`
                    })
                },                
//                 '뿜빠이하기' : () => {
//                     store.updateState({
//                         ...store.getState(),
//                         isListening : true,
//                         listenEvent : async (msg) => {
//                             const arr = msg.split(" ")
//                             const charge = Number(arr[0])
//                             arr.shift()
//                             let response = `${charge}원을\n\n`
//                             for(let i = 0; i < arr.length; i++){
//                                 response += `${arr[i]}\n`
//                             }
//                             response += "\n끼리 뿜빠이하면 될까요?\n맞으면 1 아니면 2"
//                             store.updateState({
//                                 ...store.getState(),
//                                 isListening : true,
//                                 listenEvent : async (msg) => {
//                                     if(msg === "1"){
//                                         console.log("한데")
//                                     } else if(msg === "2") {
//                                         console.log("안한데")
//                                     } else {
//                                         console.log("뭔데이건")
//                                     }
//                                 }
//                             })

//                             return ({
//                                 isHaveResponse : true,
//                                 response,
//                             })
//                         },
//                     })
//                     return ({
//                         isHaveResponse : true,
//                         response : 
// `
// 금액과 뿜빠이 명단을 입력해주세요
// ex
// 30000 김기현 임태섭 김명식 김종민
// `
//                     })
//                 },
                // '거래처리' : () => {
                //     return ({
                //         isHaveResponse : true,
                //         response : "거래처리"
                //     })
                // }
            }
        },

        //depth 2
    ]

    const commandExcuter = async (msg, sender) => {
        if(msg === '리셋'){ return await jarvisCommands[0]['리셋']() }
        if(msg === '프리' && sender === '김기현'){ return await jarvisCommands[0]['프리']() }
        if(store.getState().isListening){
            return await store.getState().listenEvent(msg, sender)
        }
        const { currentDepth, currentSubject } = store.getState()
        let cmdFunc
        if(currentDepth === 0){
            cmdFunc = jarvisCommands[currentDepth][msg] || notFoundCmd
        } else {
            console.log("여기드가야지")
            console.log(currentDepth, currentSubject, msg)
            cmdFunc = jarvisCommands[currentDepth][currentSubject][msg] || notFoundCmd
            console.log(cmdFunc)
        }
        const aa = await cmdFunc(msg)
        return aa
    }    

    return ({
        store,
        processor,
        commandExcuter,
        config,
    })
}

module.exports = jarvisLauncher