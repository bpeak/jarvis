const axios = require('axios')
const cheerio = require('cheerio')

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

module.exports = getWeather