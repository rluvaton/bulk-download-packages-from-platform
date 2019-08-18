// For Web scraping
const axios = require('axios');
const cheerio = require('cheerio');

// Npm package sizing
const getSizes = require('package-size');

const request = require("request");


const LIBRARIES_IO_API_KEY = '<insert API Key here>';

function defaultErrorHandling(err) {
    console.error(err);
}

function sleep(ms) {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

async function getPopularPackagesInNpm(total, page = 1) {
    let popularPackagesName = [];
    let tempPagePackages;

    total = total || 0;
    page = page || 1;

    let packagesLeft = total;

    while (packagesLeft > 0) {
        tempPagePackages = await getPopularPackagesInSinglePage(page).catch(defaultErrorHandling);

        // I'm doing if and not just `tempPagePackages.slice(0, packagesLeft)`
        // because if we won't need to slice the array eventually than it's 99.6% slower doing it without the if
        tempPagePackages = (packagesLeft < tempPagePackages.length) ? tempPagePackages.slice(0, packagesLeft) : tempPagePackages;

        packagesLeft -= tempPagePackages.length;
        page++;

        popularPackagesName = popularPackagesName.concat(tempPagePackages);

        // Can request only 60 requests/minutes = request every second
        await sleep(1000).catch(defaultErrorHandling);
    }

    return popularPackagesName;
}

async function getPopularPackagesInSinglePageScrape(offset) {
    const url = `https://www.npmjs.com/browse/depended?offset=${offset}`;

    const html = await scrapeUrl(url)
        .catch(defaultErrorHandling);

    const packageNameJsPath = '#app > div > div.flex.flex-column.vh-100 > main > div > div._0897331b.mb4.bt.b--black-10 > section > div.w-80 > div.flex.flex-row.items-end.pr3 > a > h3';
    const packageNameElements = getPackageNameElementsFromHtml(html, packageNameJsPath);

    return Array.from(packageNameElements).map(getPackageNameFromPackageEl).filter((name) => name);
}

function getPackagesNameFromResponse(res) {
    if(!res) {
        return [];
    }

    res = JSON.parse(res);

    return res.map((packageData) => packageData.name);
}

function getLibrariesRequestOptions(page, platform, sortType, perPage) {
    platform = platform || 'npm';
    sortType = sortType || 'dependents_count';
    perPage = perPage || 100;

    return {
        method: 'GET',
        url: 'https://libraries.io/api/search',
        qs: {
            api_key: LIBRARIES_IO_API_KEY,
            platforms: platform,
            sort: sortType,
            page: page,
            per_page: perPage
        },
        headers:
            {
                'cache-control': 'no-cache',
                Connection: 'keep-alive',
                'accept-encoding': 'gzip, deflate',
                cookie: '_libraries_session=ejk2QzhLZjdUNFFHcXdYdU5XTHUvRVlnNEFPaHJzTmlGZ29aQ01vUkJvSU4xR0VXMURxd29WaWVTMnQ0ZUVWNmI5bUtVaWJjV1NNYllmWU5JUW5TaXBKUDl1d2dzTGxFVURjYkZubnUzdGlsOFB3OU96cHRIS1pNNnp3dEd3YndzSXI4eVplYm9EdW1tVHk5MFZnbEd3PT0tLXNSeDdMN0pnblQ0M1N1NlNFUTUwM0E9PQ%3D%3D--b0aac01e1ce281f07a5dc1a977f7b7f82cef1dfe',
                Host: 'libraries.io',
                'Cache-Control': 'no-cache',
                Accept: '*/*',
            }
    };
}

async function getPopularPackagesInSinglePage(page = 1) {

    const options = getLibrariesRequestOptions(page, 'npm', 'dependents_count', 100);

    const res = await requestWithPromise(options)
        .catch(defaultErrorHandling);

    return getPackagesNameFromResponse(res);
}

function requestWithPromise(options, getBody = true) {
    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) {
                reject(error);
                return;
            }

            resolve(getBody ? body : response);
        });
    });
}

async function scrapeUrl(url) {
    return axios(url, {
            headers: {
                'cache-control': 'no-cache',
                Connection: 'keep-alive',
                Host: 'www.npmjs.com',
                'Postman-Token': '7165165a-db4b-4093-a73d-8d47a8be068d,fd90479c-483e-4aeb-bfa5-f3357c391693',
                'Cache-Control': 'no-cache',
                'manifest-hash': '1fbe3c7bd6f7515a64ca',
                'sec-fetch-site': 'same-origin',
                'x-requested-with': 'XMLHttpRequest',
                authority: 'www.npmjs.com',
                referer: url,
                accept: '*/*',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/76.0.3809.100 Safari/537.36',
                'accept-language': 'en-US,en;q=0.9,he;q=0.8',
                'x-spiferack': '1',
                'accept-encoding': 'gzip',
                cookie: '_ga=GA1.2.2109964404.1521382342; optimizelyEndUserId=oeu1521382341900r0.7978010614615352; optimizelySegments=^%^7B^%^7D; optimizelyBuckets=^%^7B^%^7D; ConstructorioID_client_id=7dd238b3-2100-4896-9351-352cc398278d; constructorio_t=djF8fDdkZDIzOGIzLTIxMDAtNDg5Ni05MzUxLTM1MmNjMzk4Mjc4ZA==; hubspotutk=b9f4ab03988d888db62710cd49b4436d; __hs_opt_out=no; wub=Fe26.2**7a47df5aeb1092f4ac19478f599f117dbe7d6bb3df84130e01f0f8ebd5dac135*7EOKd5QpP2cDuXoADCLwBQ*zxTBzxTfeEI1ros58aBRBR7wH4BgEl3L5p8HnbzzRhH3SIQ4uZp02z3qitJrSg0D43XwYrYvH2ralyfA_AMERszuCo-UscRKa0vjEUyrSg6E9yPM5DF21FFnbth6wgX-nVjxTT7QPqGjl8HP7pZJiA**06a6c05912c0d246acbd6e5d2ea80e1d52d627019c054272cc6edc1edf969781*x3SCWALVP_mxniZ-MKaHInKKRTlLrLrbQNMtR6mYCyI; __cfduid=d7653375bfeb0e4d09a322e1c6f47c21c1556046568; _gcl_au=1.1.1190553863.1563867155; _gid=GA1.2.1316677122.1566111102; __hssrc=1; __hstc=72727564.b9f4ab03988d888db62710cd49b4436d.1550733423649.1566111102019.1566124009859.66; cs=4cG7WYSszq9T45p0vp5hNdmjpgMvioBzTF2xg2yzJ9u; _gat=1; __hssc=72727564.25.1566124009859,_ga=GA1.2.2109964404.1521382342; optimizelyEndUserId=oeu1521382341900r0.7978010614615352; optimizelySegments=^%^7B^%^7D; optimizelyBuckets=^%^7B^%^7D; ConstructorioID_client_id=7dd238b3-2100-4896-9351-352cc398278d; constructorio_t=djF8fDdkZDIzOGIzLTIxMDAtNDg5Ni05MzUxLTM1MmNjMzk4Mjc4ZA==; hubspotutk=b9f4ab03988d888db62710cd49b4436d; __hs_opt_out=no; wub=Fe26.2**7a47df5aeb1092f4ac19478f599f117dbe7d6bb3df84130e01f0f8ebd5dac135*7EOKd5QpP2cDuXoADCLwBQ*zxTBzxTfeEI1ros58aBRBR7wH4BgEl3L5p8HnbzzRhH3SIQ4uZp02z3qitJrSg0D43XwYrYvH2ralyfA_AMERszuCo-UscRKa0vjEUyrSg6E9yPM5DF21FFnbth6wgX-nVjxTT7QPqGjl8HP7pZJiA**06a6c05912c0d246acbd6e5d2ea80e1d52d627019c054272cc6edc1edf969781*x3SCWALVP_mxniZ-MKaHInKKRTlLrLrbQNMtR6mYCyI; __cfduid=d7653375bfeb0e4d09a322e1c6f47c21c1556046568; _gcl_au=1.1.1190553863.1563867155; _gid=GA1.2.1316677122.1566111102; __hssrc=1; __hstc=72727564.b9f4ab03988d888db62710cd49b4436d.1550733423649.1566111102019.1566124009859.66; cs=4cG7WYSszq9T45p0vp5hNdmjpgMvioBzTF2xg2yzJ9u; _gat=1; __hssc=72727564.25.1566124009859; __cfduid=df4d0a606bfcc7f70a0d5f346659b261e1566113232',
                'sec-fetch-mode': 'cors'
            }
        }
    )
        .then((res) => res.data)
        .catch((err) => {
            defaultErrorHandling(err);
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
    if (!packageNameEl || !packageNameEl.children) {
        return null;
    }

    let name = packageNameEl.children.find((child) => child && child.type === 'text' && child.data);
    return name ? name.data : null;
}

function createScriptForDownload(packagesName) {
    return `npm install ${packagesName.join(' ')}`
}

function handleDownloadScript(script) {
    console.log('The script is:');
    console.log('--------------');
    console.log(script);
}

function humanFileSize(bytes, si) {
    const thresh = si ? 1000 : 1024;
    if (Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }

    const units = si
        ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
        : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];
    let u = -1;

    do {
        bytes /= thresh;
        ++u;
    } while (Math.abs(bytes) >= thresh && u < units.length - 1);

    return `${bytes.toFixed(1)} ${units[u]}`;
}

/**
 * Get package(s) size from it's name(s)
 * @param names Package(s) name - can be string or array of names
 * @return Package name in bytes
 */
async function getPackageSizeFromNameInBytes(names) {
    names = Array.isArray(names) ? names.join(',') : names;

    const sizeData = await getSizes(names)
        .catch((err) => {
            defaultErrorHandling(err);
            return {};
        });

    return {
        size: sizeData.size,
        minified: sizeData.minified,
        gzipped: sizeData.gzipped,
    };
}

async function printPackagesSize(names) {
    const packagesSize = await getPackageSizeFromNameInBytes(names)
        .catch((err) => {
            defaultErrorHandling(err);
            return {};
        });

    const totalPackagesSize = humanFileSize(packagesSize.size);
    const totalPackagesSizeMinified = humanFileSize(packagesSize.minified);
    const totalPackagesSizeGzipped = humanFileSize(packagesSize.gzipped);

    console.log(`Total Packages size is ${totalPackagesSize} | Minified: ${totalPackagesSizeMinified} | Gzipped: ${totalPackagesSizeGzipped}`);
    return names;
}

getPopularPackagesInNpm(500, 0)
    // .then(printPackagesSize)
    .then(createScriptForDownload)
    .then(handleDownloadScript)
    .catch(console.error);

// TODO - npm set registry verdsio
