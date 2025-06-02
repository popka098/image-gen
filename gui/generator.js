const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const base_path = __dirname;
const settings = JSON.parse(
    fs.readFileSync(`${base_path}/settings.json`, "utf8")
);

const dir_name = settings["dirname"];
const data = JSON.parse(fs.readFileSync(`${base_path}/data.json`, "utf8"));
const css = fs.readFileSync(`${base_path}/style.css`, "utf8");

// Загружаем шаблон
const template = fs
    .readFileSync(`${base_path}/template.html`, "utf8")
    .replace("{{CSS}}", css);

if (!fs.existsSync(`output/${dir_name}`)) {
    fs.mkdirSync(`output/${dir_name}`);
    console.log(`Создана папка output/${dir_name}/`);
}

function replacer(index) {
    let res = template;

    for (const [key, value] of Object.entries(data[index])) {
        while (res.includes(`{{${key}}}`)) {
            res = res.replace(`{{${key}}}`, value);
        }
    }

    return res;
}

function imageToBase64(imagePath) {
    const fullPath = path.join(base_path, imagePath);
    if (!fs.existsSync(fullPath)) {
        console.error(`Файл не найден: ${fullPath}`);
        return "";
    }
    return fs.readFileSync(fullPath, { encoding: "base64" });
}

function replaceImagesWithBase64(html, data) {
    let result = html;

    // Улучшенные регулярные выражения
    const imageRegex = /src=['"]([^'"]+)['"]/g;
    const backgroundRegex = /background-image:\s*url\(['"]?([^'"()]+)['"]?\)/g;

    // Заменяем все src атрибуты
    result = result.replace(imageRegex, (match, imagePath) => {
        const base64 = imageToBase64(imagePath);
        return `src="data:image/jpeg;base64,${base64}"`;
    });

    // Заменяем все background-image
    result = result.replace(backgroundRegex, (match, imagePath) => {
        const base64 = imageToBase64(imagePath);
        return `background-image: url('data:image/jpeg;base64,${base64}')`;
    });

    return result;
}

(async () => {
    const browser = await puppeteer.launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();

    for (let i = 0; i < data.length; i++) {
        const html = replacer(i);
        const finalHtml = replaceImagesWithBase64(html, data[i]);

        await page.setContent(finalHtml, {
            waitUntil: "networkidle0",
            timeout: 30000,
        });

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
