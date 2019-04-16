const api = require('./api/index')
const dao = require('./db/dao')

const axios = require('axios')
const getLuck = async (dateOfBirth) => {
    const response = await axios.get(`https://m.search.naver.com/p/csearch/dcontent/external_api/json_todayunse_v2.naver?_callback=window.__jindo2_callback._fortune_my_0&gender=m&birth=${dateOfBirth}&solarCal=solar&time=7`)
    //text parsing to jsObject
    let { data } = response
    let str = data
    str = str.replace('window.__jindo2_callback._fortune_my_0(', "")
    str = str.replace(');', "")
    const json = JSON.stringify(eval("(" + str + ")"));
    const result = JSON.parse(json).result.day
    const { title, date, content } = result

    //manufacture
    const luck = content.reduce((luck, value, index) => {
        if(index === 0){
            luck.keyword = value.keyword
        }
        if(index === content.length - 1){
            return luck
        }
        luck.contents[value.name] = {
            desc : value.desc,
        }
        return luck
    }, {
        keyword : null,
        contents : {}
    })
    console.log(luck)
    return luck
}

const jarvisLauncher = () => {
    const config = {
        timeoutMS : 1000 * 30
    }
    
    let timer = null

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
        const setTimer = (func) => { timer = func }
        const clearTimer = () => { clearTimeout(timer) }

        return ({
            getState,
            initState,
            updateState,
            setTimer,
            clearTimer,
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
            '채팅순위' : async (msg, user, room_id) => {
                const rows = await dao.getChatRankByRoom(room_id)
                let response = "채팅순위\n"
                for(let i = 0; i < rows.length; i++){
                    response += `${i + 1}위 ${rows[i].name}   ${rows[i].count}회\n`
                }
                return ({
                    isHaveResponse : true,
                    response,
                })
            },
            '실시간검색어' : async () => {
                const responseMsg = await api.getRealTimeSearchRank()
                return ({
                    isHaveResponse : true,
                    response : responseMsg,
                })
            },
            '날씨' : async () => {
                store.updateState({
                    ...store.getState(),
                    isListening : true,
                    listenEvent : async (msg, user) => {
                        const responseMsg = await api.getWeather(msg)
                        store.updateState({
                            ...store.getState(),
                            isListening : false,
                            listenEvent : false,
                        })
                        return ({
                            isHaveResponse : true,
                            response : responseMsg,
                        })
                    }
                })
                return ({
                    isHaveResponse : true,
                    response : 
`
지역을 입력해주세요
ex) 주안
ex) 평내
ex) 남양주
ex) 구의동 
`
                })                
            },
            '위키검색' : () => {
                store.updateState({
                    ...store.getState(),
                    isListening : true,
                    listenEvent : async (msg, user) => {
                        const responseMsg = await api.getNamuWiki(msg)
                        store.updateState({
                            ...store.getState(),
                            isListening : false,
                            listenEvent : false,
                        })
                        return ({
                            isHaveResponse : true,
                            response : responseMsg,
                        })
                    }
                })
                return ({
                    isHaveResponse : true,
                    response : "검색어를 입력해주세요.",
                })
            },
            '운세2' : async () => {
                store.updateState({
                    ...store.getState(),
                    isListening : true,
                    listenEvent : async (msg, user) => {
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
                        store.updateState({
                            ...store.getState(),
                            data : luck,
                            listenEvent : (msg, user) => {
                                let response = luck.keyword + "\n\n"
                                response += ":: " + user.name + "님의 " + msg + " ::" + "\n\n"
                                response += luck.contents[msg].desc
                                store.updateState({
                                    ...store.getState(),
                                    isListening : false,
                                    listenEvent : false,
                                })
                                return ({
                                    isHaveResponse : true,
                                    response,
                                })
                            }
                        })
                        let responseMsg = "<원하시는 항목을 정확히 입력해주세요>\n\n"
                        Object.keys(luck.contents).forEach((v) => {
                            responseMsg += v + "\n"
                        })
                        return ({
                            isHaveResponse : true,
                            response : responseMsg,
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
            '오늘의운세' : async () => {
                store.updateState({
                    ...store.getState(),
                    isListening : true,
                    listenEvent : async (msg, user) => {
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
                        const luck = await api.getLuck(msg)
                        let response = user.name + "님의 " + luck.name + "\n\n"
                        response += luck.keyword + "\n\n"
                        response += luck.desc
                        store.updateState({
                            ...store.getState(),
                            isListening : false,
                            listenEvent : false,
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
날씨
실시간검색어
운세2
오늘의운세
채팅순위
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

    const commandExcuter = async (msg, user, room_id) => {
        if(msg === '리셋'){ return await jarvisCommands[0]['리셋']() }
        if(msg === '프리' && user.name === '김기현'){ return await jarvisCommands[0]['프리']() }
        if(store.getState().isListening){
            return await store.getState().listenEvent(msg, user)
        }
        const { currentDepth, currentSubject } = store.getState()
        let cmdFunc
        if(currentDepth === 0){
            cmdFunc = jarvisCommands[currentDepth][msg] || notFoundCmd
        } else {
            cmdFunc = jarvisCommands[currentDepth][currentSubject][msg] || notFoundCmd
        }
        const aa = await cmdFunc(msg, user, room_id)
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