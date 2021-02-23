const axios = require('axios');
const options = {
    headers: {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.182 Safari/537.36",
        "Upgrade-Insecure-Requests": 1
    }
};
/**
 * 
 * @param httpUrl https://item.jd.com/100016034394.html
 * @param reg new RegExp(/<title>【(.*?)】/)
 */
module.exports = function (httpUrl, reg) {
    return new Promise((reslove, reject) => {
        axios.get(httpUrl, options).then(res => {
            const content = res.data;
            const result = content.match(reg);
            reslove(result[1]);
        });
    });
}

