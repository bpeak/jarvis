const axios = require('axios')

const getLuck = async (dateOfBirth) => {
    const response = await axios.get(`https://m.search.naver.com/p/csearch/dcontent/external_api/json_todayunse_v2.naver?_callback=window.__jindo2_callback._fortune_my_0&gender=m&birth=${dateOfBirth}&solarCal=solar&time=7`)
    let { data } = response
    let str = data
    str = str.replace('window.__jindo2_callback._fortune_my_0(', "")
    str = str.replace(');', "")
    const json = JSON.stringify(eval("(" + str + ")"));
    const result = JSON.parse(json)
    return result.result.day.content[0]
}

module.exports = getLuck