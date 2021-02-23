const writeData = require('./utils/createJson')
const cookieArr = require('./js/cookiesJD');
const getProductName = require('./utils/axiosSC');
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
    // 不需要验证码
    await page.evaluate(() => {
        Object.defineProperty(navigator, 'webdriver', { get: () => false })
    });

    let data;
    // https://item.jd.com/100010338210.html 可以爬到商品名，商家名
    // 能拿到好评率，评价信息，具体销量值
    // https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=100016813970&score=0&sortType=5&page=0&pageSize=10&isShadowSku=0&fold=1

    // 所有商品
    await page.$$eval('.gl-i-wrap', eles => {
        // 商家销量排行(JD)
        const merChantData = {};
        // 商家销售额排行(JD)
        const merChantSalesData = {};
        // 商品销量排行(JD)
        const productData = {};
        // 商品销售额排行(JD)
        const productSalesData = {};
        // 商品好评度(Top5)
        const goodRateData = {};
        // 评价大杂烩
        const comment = {};
        eles.forEach(item => {
            // 获取每个商品详情的链接
            const proUrl = item.querySelector('.p-name a').href;
            // productId
            const productId = proUrl.match(/(\d+)\.html/)[1];
            // 金额
            let money = item.querySelector('.p-price strong i').textContent;
            // 商家名
            // 销量
            // 商品名
            // 好评度
            // 评价内容
            // 评价内容的数量
            
            // 商家销量排行(JD) 商家名 销量
            // 商家销售额排行(JD) 销量乘以金额 商家名
            // 商品销量排行(JD) 商品名 销量
            // 商品销售额排行(JD) 销量乘以金额 商品名
            // 商品好评度(Top10) 商品名 好评度
            // 评价大杂烩 评价的内容以及对应的数量
        })
        return [merChantData, merChantSalesData, productData, productSalesData, goodRateData, comment];
    });
    function merchant(obj, name, value) {
        if (obj.hasOwnProperty(name)) {
            obj[name] += value;
        } else {
            obj[name] = value;
        }
    }
    // writeData(data, '../data/merchant.json');

})
