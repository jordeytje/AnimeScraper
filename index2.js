const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({ headless: false });
    var combinedData = [];
    // myanimelist init
    const myanimePage = await browser.newPage();
    await myanimePage.goto(`https://myanimelist.net/animelist/Spoochy?status=1`, { waitUntil: 'networkidle2' });

    await myanimePage.setViewport({
        width: 1200,
        height: 800
    });

    // anichart init
    const anichartPage = await browser.newPage();
    await anichartPage.goto(`https://anichart.net/Winter-2021`, { waitUntil: 'networkidle2' });

    let tabs = await browser.pages();

    // myanimelist scrape
    await myanimePage.bringToFront();
    await myanimePage.waitForSelector('.list-table .list-table-data .data.title .link', {timeout: 0});

    let myanimeListData = await myanimePage.evaluate(() => {
        var totalHeight = 0;
        var distance = 100;
        var timer = setInterval(() => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            totalHeight += distance;

            if(totalHeight >= scrollHeight){
                clearInterval(timer);

                let animeListTitles = [];

                let entries = document.querySelectorAll('.list-table .list-table-data .data.title .link');
                entries.forEach(entry => {
                    animeListTitles.push(entry.innerHTML);
                });

                return animeListTitles
            }
        }, 100);

    });

    // anichart scrape
    let latestTab = tabs[tabs.length - 1];
    await latestTab.bringToFront();
    await latestTab.waitForSelector('.card-list .media-card .title', {timeout: 0});
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
})();

