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
    debug('Running cache update')

    dao.getAllComics().forEach(comicRecord => {
        debug(`Updating ${comicRecord.name}`)

        fetch.fetchFeed(comicRecord.rss)
            .then(feed => {
                const comic = {name: comicRecord.name}
                comic.episodes = getComicFromFeed(feed)
                //todo: save this shit to the db before downloading, god damnit
                downloadAndSave(comic)
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
        const rawDate = $item.find('pubDate').text()

        comics.push({
            date: moment(rawDate).format('Y-MM-DD'),
            path: '',
            url: $content('p img').attr('src')
        })
    })

    //todo: this returns episodes not fucking comics, wtf was i thinking
    return comics
}

/*
 * Takes array of comics, determines filename for images and downloads
 */
function downloadAndSave(comic) {
    comic.episodes.forEach(episode => {
        fetch.getHeaders(episode.url)
            .then(response => {
                //todo: download shouldn't make this shit. something else should before hand
                const extension = mime.extension(response['content-type'])
                const folder = sanitize(comic.name).replace(/ /g, '_')
                const file = `${episode.date}.${extension}`
                const promise = fetch.downloadImage(folder, file, episode.url)

                //Being we skip images we already have, no promise may be returned
                if (promise) {
                    promise
                        .then(() => dao.save(comic))
                        .catch(err => debug(err))
                }
            })
            .catch(err => debug(err))
    })
}