const globals = require('./globals')

//Library includes
const cheerio = require('cheerio')
const debug = require('debug')('CleanComic:cache')
const mime = require('mime-types')
const moment = require('moment')
const path = require('path')
const sanitize = require('sanitize-filename')

//Module includes
const dao = require('./dao')
const fetch = require('./fetch')

/*
 * Goes through each feed record, checks for comic updates and downloads them
 */
exports.update = function cache() {
    dao.getAllComics().forEach(comicRecord => {
        fetch.fetchFeed(comicRecord.rss)
            .then(feed => {
                const comic = {name: comicRecord.name}
                comic.episodes = getComicFromFeed(feed)
                download(comic)
            })
            .catch(err => debug(err))
    })
}

/*
 * Goes through XML feed and returns list of comic dates and URLs
 */
function getComicFromFeed(xmlFeed) {
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
        fetch.getHeaders(episode.url)
            .then(response => {
                const extension = mime.extension(response['content-type'])
                const folder = sanitize(comic.name).replace(/ /g, '_')
                const file = `${moment(episode.date).format('Y-MM-DD')}.${extension}`
                fetch.downloadImage(folder, file, episode.url)
            })
    })
}