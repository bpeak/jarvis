const axios = require('axios')
const cheerio = require('cheerio')

const getRealTimeSearchRank = async() => {
    const response = await axios.get(`https://search.naver.com/search.naver?where=nexearch&sm=tab_jum&query=%EB%84%A4%EC%9D%B4%EB%B2%84+%EC%8B%A4%EC%8B%9C%EA%B0%84+%EA%B2%80%EC%83%89%EC%96%B4+%EC%88%9C%EC%9C%84`)
    const html = response.data
    const $ = cheerio.load(html)
    const realTimeSearchs = {
        "뉴스" : [],
        "연예" : [],
    }
    $(".lst_realtime_srch").toArray().forEach((ol, index) => {
        let keyword = null
        if(index === 0){ keyword = "뉴스" }
        if(index === 1){ keyword = "연예" }
        if(index === 0 || index === 1){
            $(ol).children('li').children('a').children('span').children('span').toArray().map((span) => {
                if(keyword){
                    realTimeSearchs[keyword].push($(span).text())
                }
            })
        }
    })
    let responseText = ""
    for(let category in realTimeSearchs){
        responseText += `<< ${category} >>\n`
        realTimeSearchs[category].forEach((v, index) => {
            responseText += `\n(${index + 1}) ${v}`
        })
        responseText += "\n\n"
    }
    return responseText
}

module.exports = getRealTimeSearchRank