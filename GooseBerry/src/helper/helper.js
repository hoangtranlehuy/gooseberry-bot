const NewsCategory = require("../sampleData/category");
const NewsSourceRSS = require("../sampleData/source");

function getImageLink(description) {
    const imgRegex = /<img[^>]+src="([^">]+)"/;
    const match = description.match(imgRegex);
    if (description.includes('vcdn1-vnexpress.vnecdn.net'))
    {
        return match ? match?.[1].replace('https://vcdn1','https://i1').replace('w=1200&amp;h=0&amp;q=100&amp;dpr=1&amp;fit=crop&amp;s','w=1200&h=0&q=100&dpr=1&fit=crop&s') : null;
    }
    return match ? match[1] : null;
}

function randomIndex(range) {
    return Math.floor(Math.random() * range);
} 

function getLinkFromNewsString(newsString, linksMap) {
    const stringPart = newsString.slice(5).trim();
    var respondingCategory;
    if(stringPart === ''){
        var keys = Object.keys(NewsCategory);
        respondingCategory = NewsCategory?.[keys[randomIndex(keys.length)]];
        console.log(respondingCategory, keys);
    } else {
        respondingCategory = linksMap[stringPart];
    } 
    if (stringPart === null) return null;
    const respondingLink = "https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2F"+NewsSourceRSS?.[randomIndex(NewsSourceRSS.length)]+"%2Frss%2F"+respondingCategory+".rss" + "&api_key=p3ec3qjcvu3b9kiv2chcrvn8alt2xg857mhhvlf9&count=10";
    console.log(respondingLink, NewsSourceRSS);
    return respondingLink || null;
}

module.exports = {
    getImageLink,
    getLinkFromNewsString,
    randomIndex
}