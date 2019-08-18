// For Web scraping
const axios = require('axios');
const cheerio = require('cheerio');


async function getPopularPackagesInNpm(total, offset = 0) {
    let popularPackagesName = [];
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

    return popularPackagesName;
}

async function getPopularPackagesInSinglePage(offset) {
    const url = `https://www.npmjs.com/browse/depended?offset=${offset}`;

    const html = await scrapeUrl(url);

    const packageNameJsPath = '#app > div > div.flex.flex-column.vh-100 > main > div > div._0897331b.mb4.bt.b--black-10 > section > div.w-80 > div.flex.flex-row.items-end.pr3 > a > h3';
    const packageNameElements = getPackageNameElementsFromHtml(html, packageNameJsPath);

    return Array.from(packageNameElements).map(getPackageNameFromPackageEl).filter((name) => name);
}

async function scrapeUrl(url) {
    return axios(url)
        .then((res) => res.data)
        .catch((err) => {
            console.error(err);
            throw err;
        });
}

function getPackageNameElementsFromHtml(html, packageNameJsPath) {
    const $ = scrapePage(html);

    return $(packageNameJsPath);
}

function scrapePage(html) {
    return cheerio.load(html);
}

function getPackageNameFromPackageEl(packageNameEl) {
    if(!packageNameEl || !packageNameEl.children) {
        return null;
    }

    let name = packageNameEl.children.find((child) => child && child.type === 'text' && child.data);
    return name ? name.data : null;
}

