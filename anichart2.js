const puppeteer = require('puppeteer');

const scrapeAnime = async () => {
    const browser = await puppeteer.launch({ headless: false });

    // myanimelist init
    const myanimePage = await browser.newPage();
    await myanimePage.goto(`https://myanimelist.net/animelist/Spoochy?status=1`, { waitUntil: 'networkidle2' });

    // anichart init
    const anichartPage = await browser.newPage();
    await anichartPage.goto(`https://anichart.net/Winter-2021`, { waitUntil: 'networkidle2' });

    let tabs = await browser.pages();

    // myanimelist scrape
    await myanimePage.bringToFront();
    // await myanimePage.waitForNavigation({ waitUntil: 'networkidle0' });
    let myanimeListData = await myanimePage.evaluate(() => {
        let animeListTitles = [];

        let entries = document.querySelectorAll('.list-table .list-table-data .data.title .link');
        entries.forEach(entry => {
            animeListTitles.push(entry.innerHTML);
        });

        return animeListTitles
    });

    // anichart scrape
    let latestTab = tabs[tabs.length - 1];
    await latestTab.bringToFront();
    // await latestTab.waitFor(4000);
    let anichartData = await anichartPage.evaluate(() => {
        let animeListTitles = [];

        let entries = document.querySelectorAll('.card-list .media-card .title');
        entries.forEach(entry => {
            animeListTitles.push(entry.innerHTML);
        });

        return animeListTitles
    });

    console.log(myanimeListData);
    console.log(anichartData);


    await browser.close();

    return myanimeListData;
};

scrapeAnime();
