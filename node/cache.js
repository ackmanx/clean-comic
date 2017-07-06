const globals = require('./globals')

//Library includes
const debug = require('debug')('CleanComic:cache')
const cheerio = require('cheerio')
const sanitize = require('sanitize-filename')
const path = require('path')
const moment = require('moment')

//Module includes
const fetch = require('./fetch')
const dao = require('./dao')

/*
 * Goes through each feed record, checks for comic updates and downloads them
 */
exports.update = function cache() {
    //todo: loop
    const comicRecord = dao.find(0)

    fetch.fetchFeed(comicRecord.rss)
        .then(feed => {
            const comic = {name: comicRecord.name}
            comic.episodes = parseFeedResponse(feed)
            download(comic)
        })
        .catch(err => debug(err))
}

/*
 * Goes through XML feed and returns list of comic dates and URLs
 */
//todo: use better name
function parseFeedResponse(xmlFeed) {
    const comics = []
    const $ = cheerio.load(xmlFeed, {xmlMode: true})

    $('item').each(function () {
        const $item = $(this)
        const $content = cheerio.load($item.find('content\\:encoded').text())

        let episode = {
            date: $item.find('pubDate').text(),
            url: $content('p img').attr('src')
        }

        comics.push(episode)
    })

    return comics
}

/*
 * Takes array of comics, determines filename for images and downloads
 */
function download(comic) {
    comic.episodes.forEach(episode => {
        const folderName = sanitize(comic.name).replace(/ /g, '_')
        const filename = moment(episode.date).format('Y-MM-DD')
        //todo: extension needed
        const fullPath = path.join(folderName, filename)
        debug(fullPath)
    })
}