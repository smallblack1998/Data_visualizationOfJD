async function getRect(page, selector) {
    return await page.$eval(selector, el => {
        let res = el.getBoundingClientRect()
        return {
          x: res.x,
          y: res.y,
          width: res.width,
          height: res.height
        }
    })
}
// 将鼠标移到某处
async function move(page, initialX, initialY, xlength = 0, ylength = 0) {
    await page.waitForTimeout(1000);
    const mouse = page.mouse;
    await mouse.move(initialX, initialY);
    await mouse.down();
    await mouse.move(initialX + xlength, initialY + ylength, { steps: 25 })
    await mouse.up();
    await page.waitForTimeout(2000);
}
module.exports = {getRect, move};