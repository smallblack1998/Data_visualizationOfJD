const writeData = require('./utils/createJson')
const cookieArr = require('./js/cookies');
const { getRect, move } = require('./utils/verifiyCode');
const puppeteer = require('puppeteer');
const options = {
    // 页面全屏defaultViewport: null, args: ['--start-maximized']
    defaultViewport: null,
    headless: false,
    ignoreDefaultArgs: ['--enable-automation'],
    args: ['--start-maximized']
}

const url = 'https://search.jd.com/Search?keyword=%E6%89%8B%E6%9C%BA&wq=%E6%89%8B%E6%9C%BA&page=1&click=0';
puppeteer.launch(options).then(async browser => {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/88.0.4324.150 Safari/537.36')
    // for (const item of cookieArr) {
    //     await page.setCookie(item);
    // }
    await page.goto(url);
    // await page.setContent("<script></script>")
    let cookie = await page.evaluate(() => document.cookie);
    console.log("cookie :" + cookie);
    // await page.waitForTimeout(2000);
    // // 不需要验证码
    // await page.evaluate(() => {
    //     Object.defineProperty(navigator, 'webdriver', { get: () => false })
    // });
    // if (await page.$('#nc_1_n1t #nc_1_n1z')) {
    //     // 获取滑块位置
    //     let slidePosition = await getRect(page, "#nc_1_n1z")
    //     // 滑块可滑动区域
    //     let blockPosition = await getRect(page, "#nc_1__scale_text")
    //     // 鼠标初始位置
    //     let initialX = slidePosition.x + slidePosition.width / 2
    //     let initialY = slidePosition.y + slidePosition.height / 2
    //     let xlength = blockPosition.width - slidePosition.width * 0.75
    //     // 开始移动滑块
    //     await move(page, initialX, initialY, xlength)
    //     await page.waitForTimeout(2000);
    //     // let errEl = await page.$("#nc_1_n1t #nc_1_n1z")
    //     // if (!errEl) {
    //     //     // 出错重置
    //     //     break;
    //     // }
        
    // }
    // let data;
    // // 地区销量数据
    // // let data = await page.$$eval('.items div[data-category="auctions"]', eles => {
    // //     const Locationdata = {};
    // //     eles.forEach(item => {
    // //         let deal = item.querySelector('.deal-cnt').textContent;
    // //         // 将字符串中拿取销量值
    // //         deal.replace(/[1-9]*\.\d+|\d+/, $1 => {
    // //             deal = $1.indexOf('.') === -1 ? Number($1) : parseFloat(deal) * 10000;
    // //         })
    // //         let location = item.querySelector('.location').textContent;
    // //         location = location.replace(/\s/g,'-');
    // //         if (Locationdata.hasOwnProperty(location)) {
    // //             Locationdata[location] += deal;
    // //         } else {
    // //             Locationdata[location] = deal;
    // //         }
    // //     })
    // //     return Locationdata;
    // // });
    // // writeData(data, 'data/location.json');


    // // 商家销量排行
    // data = await page.$$eval('.items div[data-category="auctions"]', eles => {
    //     const merChantData = {};
    //     eles.forEach(item => {
    //         let deal = item.querySelector('.deal-cnt').textContent;
    //         // 将字符串中拿取销量值
    //         deal.replace(/[1-9]*\.\d+|\d+/, $1 => {
    //             deal = $1.indexOf('.') === -1 ? Number($1) : parseFloat(deal) * 10000;
    //         })
    //         const Merchant = item.querySelector('.shop>a').children[1].textContent;
    //         if (merChantData.hasOwnProperty(Merchant)) {
    //             merChantData[Merchant] += deal;
    //         } else {
    //             merChantData[Merchant] = deal;
    //         }
    //     })
    //     return merChantData;
    // });
    // writeData(data, '../data/merchant.json');

    // // 价格销量排行
    // data = await page.$$eval('.items div[data-category="auctions"]', eles => {
    //     const moneyData = {};
    //     eles.forEach(item => {
    //         let deal = item.querySelector('.deal-cnt').textContent;
    //         const money = item.querySelector('.price strong').textContent;
    //         deal.replace(/[1-9]*\.\d+|\d+/, $1 => {
    //             deal = $1.indexOf('.') === -1 ? Number($1) : parseFloat(deal) * 10000;
    //         })
    //         if (moneyData.hasOwnProperty(money)) {
    //             moneyData[money] += deal;
    //         } else {
    //             moneyData[money] = deal;
    //         }
    //         console.log(deal);
    //         console.log(money);
    //     })
    //     return moneyData;
    // });
    // writeData(data, '../data/money.json');

    // // 商家人气排行榜(人气数、品牌名称+型号)

})
