const globals = require('./globals')

//Library includes
const debug = require('debug')('CleanComic:cache')
const cheerio = require('cheerio')

//Module includes
const fetch = require('./fetch')

/*
 * Goes through each feed record, checks for comic updates and downloads them
 */
exports.update = function cache() {
    const something = fetch.fetchFeedForId(0)
        .then(feed => {
            const comics = parseFeedResponse(feed)
            //todo: create file name and download
        })
}

/*
 * Goes through XML feed and returns list of comic dates and URLs
 */
function parseFeedResponse(xmlFeed) {
    const comics = []
    const $ = cheerio.load(xmlFeed, {xmlMode: true})

    $('item').each(function () {
        const $item = $(this)
        const $content = cheerio.load($item.find('content\\:encoded').text())

        let comic = {
            date: $item.find('pubDate').text(),
            url: $content('p img').attr('src')
        }

        comics.push(comic)
    })

    return comics
}
