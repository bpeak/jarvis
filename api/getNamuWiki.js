const axios = require('axios')
const cheerio = require('cheerio')

const getNamuWiki = async (keyword) => {
    const encodedKeyword = encodeURI(keyword)
    const response = await axios.get(`https://namu.wiki/w/${encodedKeyword}`)
    const html = response.data
    const $ = cheerio.load(html)
    const responseText = $('.wiki-inner-content').text()
    console.log(responseText)
    return responseText
}

module.exports = getNamuWiki