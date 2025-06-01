const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const base_path = __dirname;
const settings = JSON.parse(
    fs.readFileSync(`${base_path}/settings.json`, "utf8")
);

const dir_name = settings["dirname"];
const data = JSON.parse(fs.readFileSync(`${base_path}/data.json`, "utf8"));
const template = fs.readFileSync(`${base_path}/template.html`, "utf8");

if (!fs.existsSync(`output/${dir_name}`)) {
    fs.mkdirSync(`output/${dir_name}`);
    console.log(`Создана папка output/${dir_name}/`);
}

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    for (let i = 0; i < data.length; i++) {
        const html = template.replace("{{title}}", data[i].title);
        await page.setContent(html, { waitUntil: "networkidle0" });
        await page.setViewport({
            width: settings["width"],
            height: settings["haight"],
        });
        await page.screenshot({
            path: `output/${dir_name}/${settings["name"]}${i + 1}.jpeg`,
            type: "jpeg",
            quality: 90,
        });
        console.log(`Сохранено: ${settings["name"]}${i + 1}.jpeg`);
    }

    await browser.close();
})();
