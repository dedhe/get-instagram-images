const puppeteer = require("puppeteer");
const express = require("express")
const app = express()
let data = async function (name) {
    try {
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        await page.setUserAgent(
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36"
        );
        await page.goto(`https://www.instagram.com/${name}/`);
        await page.waitForSelector(".eLAPa");
        const data = await page.evaluate(() => {
            const img = Array.from(document.querySelectorAll('div[class="KL4Bh"] > img'));
            let link = Array.from(document.querySelectorAll("div[class='v1Nh3 kIKUG  _bz0w'] > a"))
            let images = img.map(element => {
                return element.src
            })
            let links = link.map(element => {
                return element.href
            })
            return {
                images,
                links
            };
        });
        await browser.close();
        return data
    } catch (e) {
        console.error("error", e);
    }
}

app.get('/:name', async (req, res) => {
    let {name} = req.params
    try {
        res.json(await data(name))
    } catch (error) {
        console.log(error)
        res.json(error)
    }


})


app.listen(8080, () => {
    console.log(`ready to rock`)
})