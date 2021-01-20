const express = require('express'); // Adding Express
const app = express(); // Initializing Express
const puppeteer = require('puppeteer'); // Adding Puppeteer

app.set('view engine', 'ejs');


(async () => {
    app.get('/', async (req, res) => {
        const data = await scrapeAnime();
        res.render('test', {data: data});
        app.use(express.static('files'))
    });

    app.listen(3000, function() {
        console.log('Running on port 3000.');
    });

    const scrapeAnime = async () => {
        const browser = await puppeteer.launch({ headless: true });
        var combinedData = [];
        // myanimelist init
        const myanimePage = await browser.newPage();
        await myanimePage.goto(`https://myanimelist.net/animelist/Spoochy?status=1`, { waitUntil: 'networkidle2' });

        // anichart init
        const anichartPage = await browser.newPage();
        await anichartPage.goto(`https://anichart.net/Winter-2021`, { waitUntil: 'networkidle2' });

        await anichartPage.setViewport({
            width: 1200,
            height: 800
        });

        let tabs = await browser.pages();

        // myanimelist scrape
        await myanimePage.bringToFront();
        await myanimePage.waitForSelector('.list-table .list-table-data .data.title .link', {timeout: 0});

        let myanimeListData = await myanimePage.evaluate(() => {
            let animeListTitles = [];

            let entries = document.querySelectorAll('.list-table .list-table-data');
            entries.forEach(entry => {
                animeListTitles.push(entry.innerHTML);
            });

            return animeListTitles
        });

        // let myanimeListDataImg = await myanimePage.evaluate(() => {
        //     let animeListImg = [];
        //
        //     let entries = document.querySelectorAll('.list-table .list-table-data .data.image img');
        //     entries.forEach(entry => {
        //         animeListImg.push(entry.getAttribute('src'));
        //     });
        //
        //     return animeListImg
        // });

        // anichart scrape
        let latestTab = tabs[tabs.length - 1];
        await latestTab.bringToFront();
        await latestTab.waitForSelector('.card-list .media-card .title', {timeout: 0});
        await autoScroll(latestTab);
        let anichartData = await anichartPage.evaluate(() => {
            let animeListTitles = [];

            let entries = document.querySelectorAll('.card-list .media-card');
            entries.forEach(entry => {
                animeListTitles.push(entry.innerHTML);
            });

            return animeListTitles
        });

        combinedData.push(myanimeListData);
        combinedData.push('arraySeparator');
        combinedData.push(anichartData);

        console.log(myanimeListData);

        await browser.close();

        return combinedData;
    };

})();

async function autoScroll(page){
    await page.evaluate(async () => {
        await new Promise((resolve, reject) => {
            var totalHeight = 0;
            var distance = 100;
            var timer = setInterval(() => {
                var scrollHeight = document.body.scrollHeight;
                window.scrollBy(0, distance);
                totalHeight += distance;

                if(totalHeight >= scrollHeight){
                    clearInterval(timer);
                    resolve();
                }
            }, 100);
        });
    });
}