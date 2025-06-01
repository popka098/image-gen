const puppeteer = require("puppeteer");
const fs = require("fs");

const base_path = "templates/Image1/"
const data = JSON.parse(fs.readFileSync(`${base_path}data.json`, "utf8"));
const template = fs.readFileSync(`${base_path}template.html`, "utf8");

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let i = 0; i < data.length; i++) {
        const html = template.replace("{{title}}", data[i].title);
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.setViewport({ width: 1200, height: 630 });
        await page.screenshot({
            path: `output/banner-${i + 1}.jpeg`,
            type: "jpeg",
            quality: 90,
        });
        console.log(`Сохранено: banner-${i + 1}.jpeg`);
    }

    await browser.close();
})();
