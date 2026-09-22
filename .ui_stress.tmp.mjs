/**
 * 压力复现: 反复 hover(触发浮层过渡) + 拖拽, 最大化过渡竞争窗口
 */
import { chromium } from "playwright";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
const errors = [];
page.on("pageerror", e => errors.push(String(e).slice(0, 200)));
await page.goto("http://localhost:8080/", { waitUntil: "domcontentloaded" });
await page.waitForSelector("#categories .category-title", { timeout: 60000 });
await page.waitForTimeout(1500);

const ops = page.locator("#categories .op-list li");
for (let round = 0; round < 5; round++) {
    for (const i of [0, 1, 2]) {
        await ops.nth(i).hover();
        await page.waitForTimeout(120);
    }
    await ops.nth(0).hover();
    await page.waitForTimeout(100);
    await page.mouse.down();
    await page.mouse.move(500, 300, { steps: 6 });
    await page.mouse.up();
    await page.waitForTimeout(200);
    const del = page.locator("#recipe .remove-icon").first();
    if (await del.count()) { await del.click(); await page.waitForTimeout(300); }
}
await page.waitForTimeout(2000);

const overlay = await page.evaluate(() => {
    const o = document.querySelector("#webpack-dev-server-client-overlay");
    return !!o && o.offsetWidth > 0;
});
console.log("错误遮罩出现:", overlay);
console.log("pageerror 数:", errors.length, errors.slice(0, 3));
await page.screenshot({ path: "/tmp/ctfx_ui_stress.png" });
await browser.close();
process.exit(overlay || errors.length ? 1 : 0);
