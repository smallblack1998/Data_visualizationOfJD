const axios = require('axios');
const cheerio = require('cheerio');
const iconv = require('iconv-lite');
const options1 = {
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        "Upgrade-Insecure-Requests": 1,
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "zh-CN,zh;q=0.9,en-US;q=0.8,en;q=0.7",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": 'none'
    }
};
const options2 = {
    headers: {
        "Accept": "*/*",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36"
    },
    responseType: 'arraybuffer'
};
/**
 * 
 * @param httpUrl https://item.jd.com/100016034394.html
 */
async function getProAndMerName(httpUrl) {
    const res = await axios.get(httpUrl, options1);
    const $ = cheerio.load(res.data);
    let proName = $('.parameter2>li').attr('title');
    //将多个空格转换为一个空格
    proName = proName.replace(/\s+/g, $1 => {
        if ($1.length > 1) {
            return ' ';
        }
        return $1;
    });
    let merName = $('.head a:first').text();
    merName = merName.replace(/（.+）/, '');
    return { proName, merName }
}
async function getOtherMessage(httpUrl) {
    const res = await axios.get(httpUrl, options2);
    // 解决中文乱码
    let data = iconv.decode(Buffer.from(res.data), 'gbk');
    // data = iconv.encode(data, 'utf8').toString();
    // console.log(data);
    let productCS = data.match(/"productCommentSummary":{(.*?)}/)[1];
    let hotCommentTS = data.match(/"hotCommentTagStatistics":\[(.*?)\]/)[1];

    data = {};
    productCS = "{" + productCS + "}";
    hotCommentTS = "[" + hotCommentTS + "]";
    data.productCommentSummary = JSON.parse(productCS);
    data.hotCommentTagStatistics = JSON.parse(hotCommentTS);

    return data;
}
module.exports = { getProAndMerName, getOtherMessage };
