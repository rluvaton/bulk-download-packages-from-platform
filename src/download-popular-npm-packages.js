// For Web scraping
const axios = require('axios');
const cheerio = require('cheerio');


async function getPopularPackagesInNpm(total, offset = 0) {
    const popularPackagesName = [];
    let tempPagePackages;

    total = total || 0;
    offset = offset || 0;

    let packagesLeft = total;

    while (packagesLeft > 0) {
        tempPagePackages = await getPopularPackagesInSinglePage(offset);

        if (packagesLeft < tempPagePackages.length) {
            tempPagePackages = tempPagePackages.slice(0, packagesLeft);
        }

        packagesLeft -= tempPagePackages.length;
        offset += tempPagePackages.length;

        popularPackagesName = popularPackagesName.concat(tempPagePackages);
    }

    return popularPackagesNames;
}

async function getPopularPackagesInSinglePage(offset) {

    const url = `https://www.npmjs.com/browse/depended?offset=${offset}`;

    const response = axios(url).catch((err) => {
        console.error(err);
        throw err;
    });
    const html = response.data;
    debugger;
    const $ = cheerio.load(html)
    const statsTable = $('.statsTableContainer > tr');
    const topPremierLeagueScorers = [];

    statsTable.each(function () {
        const rank = $(this).find('.rank > strong').text();
        const playerName = $(this).find('.playerName > strong').text();
        const nationality = $(this).find('.playerCountry').text();
        const goals = $(this).find('.mainStat').text();

        topPremierLeagueScorers.push({
            rank,
            name: playerName,
            nationality,
            goals,
        });
    });

    console.log(topPremierLeagueScorers);

}

getPopularPackagesInSinglePage(0);