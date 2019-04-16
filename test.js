const axios = require('axios')
const cheerio = require('cheerio')

const searchNamuwiki = async (keyword) => {
    const encodedKeyword = encodeURI(keyword)
    const response = await axios.get(`https://namu.wiki/w/${encodedKeyword}`)
    const html = response.data
    const responseText = $('.wiki-inner-content').text()
}

const getWeather = async (location) => {
    const queryString = encodeURI(`${location}+날씨`)
    const response = await axios.get(`https://search.naver.com/search.naver?sm=tab_hty.top&where=nexearch&query=${queryString}&oquery=${queryString}&tqi=U7TsrdpVuE8ssb1JT2lssssstCl-106694`)
    const html = response.data
    const $ = cheerio.load(html)
    let responseText = ""
    const searchedLocation = $('._areaSelectLayer').find('.btn_select').text().trim()
    const detail = $('.today_area').find('.cast_txt').text()
    const maxTemp = $('.today_area').find('.max').text()
    const minTemp = $('.today_area').find('.min').text()
    responseText += `${searchedLocation} 날씨\n\n`
    responseText += detail + "\n\n"
    responseText += `최고기온 : ${maxTemp}\n`
    responseText += `최저기온 : ${minTemp}\n`
    //more details
    $('.today_area').find('.indicator').text().trim().split(' ').filter((v) => {
        return v !== ""
    }).forEach((v, index) => {
        if(index % 2 === 0){
            responseText += v + " : "
        } else {
            responseText += v + "\n"
        }
    })
    return responseText
}

const getRealTimeSearchs = async() => {
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
    return luck
}

const func = async () => {
    try{
        searchNamuwiki("뉴클리어")
        // getWeather("주안")
        // const responseMsg = await getRealTimeSearchs()
        // console.log(responseMsg)
        // console.log(tests)
    }
    catch(err){
        // console.log(err)
    }
    // const luck = await getLuck("19930402")
    // console.log(luck)
}

func()