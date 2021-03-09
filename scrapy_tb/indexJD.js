const writeData = require('./utils/createJson')
const cookieArr = require('./js/cookiesJD');
const { getProAndMerName, getOtherMessage } = require('./utils/axiosSC');
const puppeteer = require('puppeteer');
const options = {
    // 页面全屏defaultViewport: null, args: ['--start-maximized']
    defaultViewport: null,
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--start-maximized']
}
// https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=%E6%89%8B%E6%9C%BA&page=1&click=0
// https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=%E6%89%8B%E6%9C%BA&page=3&click=0
// https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=%E6%89%8B%E6%9C%BA&page=5&click=0
// https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=%E6%89%8B%E6%9C%BA&page=7&click=0
const url = 'https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=%E6%89%8B%E6%9C%BA&page=1&click=0';
// const url = 'http://127.0.0.1:5500/study_js/test.html';
puppeteer.launch(options).then(async browser => {
    const page = await browser.newPage();
    // 设置UA
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36')
    // 设置cookie
    for (const item of cookieArr) {
        await page.setCookie(item);
    }
    await page.goto(url);
    await page.waitForTimeout(1000);
    await page.evaluate(() => {
        // 不需要验证码
        Object.defineProperty(navigator, 'webdriver', { get: () => false })
    });
    // 滚屏
    await page.evaluate(() => {
        return new Promise((resolve, reject) => {
            //滚动的总高度
            var totalHeight = 0;
            //每次向下滚动的高度 300 px
            var distance = 300;
            var timer = setInterval(() => {
                //页面的高度 包含滚动高度
                var scrollHeight = document.body.scrollHeight;
                //滚动条向下滚动 distance
                window.scrollBy(0, distance);
                totalHeight += distance;
                //当滚动的总高度 大于 页面高度的一半 ，停止滚动
                if (totalHeight >= scrollHeight / 2) {
                    clearInterval(timer);
                    resolve();
                }
            }, 1000);
        })
    });
    // console.log('123');
    // https://item.jd.com/100010338210.html 可以爬到商品名，商家名
    // 能拿到好评率，评价信息，具体销量值
    // https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=100016813970&score=0&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1

    // 品牌销量排行(JD)
    const merchantData = {};
    // 品牌销售额排行(JD)
    const merchantSalesData = {};
    // 商品销量排行(JD)
    const productData = {};
    // 商品销售额排行(JD)
    const productSalesData = {};
    // 商品好评度(Top5)
    const goodRateData = {};
    // 评价大杂烩
    const comment = {};
    // 所有商品
    function createDataObj(obj, name, value) {
        if (obj.hasOwnProperty(name)) {
            obj[name] += value;
        } else {
            obj[name] = value;
        }
    }
    function sleep(time) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve();
            }, time * 1000)
        });
    }
    const data = await page.$$eval('.gl-i-wrap', eles => {
        const prourlArr = [];
        const moneyArr = [];
        eles.forEach((item, index) => {
            const proUrl = item.querySelector('.p-name a').href;
            let money = item.querySelector('.p-price strong i').textContent;
            money = parseFloat(money);
            prourlArr.push(proUrl);
            moneyArr.push(money);
        });
        return [prourlArr, moneyArr];
    });
    console.log(data);
    let [prourlArr, moneyArr] = data;

    for (let i = 0; i < prourlArr.length; i++) {
        await sleep(0.2 * i);
        // productId
        const productId = prourlArr[i].match(/(\d+)\.html/)[1];
        // 金额
        const money = moneyArr[i];
        // 获取品牌名和商品名
        const ProAndMerName = await getProAndMerName(prourlArr[i]);
        // 获取剩下的其他信息
        const otherMesObj = await getOtherMessage(`https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=${productId}&score=0&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1`)
        // 品牌名
        const merchantName = ProAndMerName.merName;
        // 商品名
        const proName = ProAndMerName.proName;
        // 销量
        let sales = otherMesObj.productCommentSummary.commentCountStr;
        sales.replace(/(\d+)\u4e07|\d+/g, ($1, $2) => {
            sales = $2 ? $2 * 10000 : $1 * 1;
        })
        // // 好评度
        const goodRate = otherMesObj.productCommentSummary.goodRateShow;
        otherMesObj.hotCommentTagStatistics.forEach((item, index) => {
            // 评价内容
            const name = item.name;
            // 评价内容的数量
            const count = item.count;
            // 评价大杂烩 评价的内容以及对应的数量 -- 饼图自定义样式
            createDataObj(comment, name, count);
        });
        // 品牌销量排行(JD) 商家名 销量  横柱状图
        createDataObj(merchantData, merchantName, sales);
        // 商家销量最高的商品和最低的商品 两个折线图
        // 品牌销售额排行(JD) 销量乘以金额 商家名
        createDataObj(merchantSalesData, merchantName, sales * money);
        // 商品销量Top20(JD) 商品名 销量 竖柱状图
        createDataObj(productData, proName, sales);
        // 如果能获取到具体的销量数据那就可以做每个分钟的手机销量图 时间 销量
        // 商品销售额排行(JD) 销量乘以金额 商品名
        createDataObj(productSalesData, proName, sales * money);
        // 商品好评度(Top10) 商品名 好评度
        createDataObj(goodRateData, proName, goodRate);
        // console.log(merchantName, proName, sales, money, goodRate);
    }
    const nameArr = ["merchantData", "merchantSalesData", "productData", "productSalesData", "goodRateData", "comment"];
    const dataArr = [merchantData, merchantSalesData, productData, productSalesData, goodRateData, comment];
    dataArr.forEach((item, index) => {
        writeData(item, `../data/${nameArr[index]}.json`)
    });
    console.log('sc end');
})
