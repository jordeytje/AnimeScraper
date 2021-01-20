function getData() {
    let dataElem = document.getElementById('scrapedData').innerHTML;
    let result = dataElem.trim().toLowerCase().split('arrayseparator').map(s => s.split(','));

    let myanimeData = result[0] = result[0].filter(item => item);
    let anichartData = result[1] = result[1].filter(item => item);
    let resultArray = [];
    let resultHtmlArray = [];
    let animeCards = [];

    console.log(myanimeData);

    // console.log(myanimeDataImg);

    var parentElem = document.querySelector(".parentContainer");
    var test = document.querySelector(".test");

    // anichartData.forEach(item => {
    //     let title = item.split("studio")[0];
    //     title = title.substr(title.lastIndexOf("title")).substr(10);
    //     title = title.substr(0,title.length -44);
    //
    //     if (myanimeData.includes(title)) {
    //         resultArray.push(item);
    //     }
    // });

    for (let i = 0; i < anichartData.length; i++) {
        let title = anichartData[i].split("studio")[0];
        title = title.substr(title.lastIndexOf("title")).substr(10);
        title = title.substr(0,title.length -44);

        myanimeData.forEach(item => {
           let newItem = item.replace("&lt;", " ");
            if (myanimeData.includes(title)) {
                resultArray.push(anichartData[i]);
            }
        });


    }

    console.log(resultArray);

    resultArray.forEach(item => {
        let newLine = item.split('&gt;');
        resultHtmlArray.push(newLine);
    });

    for (let i = 0; i < resultHtmlArray.length; i++) {
        let elem = document.createElement('div');
        elem.classList.add('card', 'mb-5', `anime-${[i]}`);

        resultHtmlArray[i].forEach(item => {
            let newItem = item.replace("&lt;", " <");
            elem.innerHTML += newItem;
        });

        test.append(elem);
    }

    let allAnimeCards = document.querySelectorAll('.test .card');

    allAnimeCards.forEach(card => {
        card.innerHTML = card.innerHTML.replace("      ", "<div>");
        card.innerHTML = card.innerHTML.replace("<!---->", "</div><div>");
        card.innerHTML = card.innerHTML.concat("</div");
    });

    animeCards.forEach(card => {
        animeCards.push(card.innerHTML);
    });

    console.log(animeCards);

}