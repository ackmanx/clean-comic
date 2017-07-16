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
const Episode = require('./dto/Episode')

/*
 * Goes through each feed record, checks for comic updates and downloads them
 */
exports.update = function cache() {
    debug('Running cache update')

    dao.getAllComics().forEach(comic => {
        debug(`Updating ${comic.name}`)

        fetch.fetchFeed(comic.rss)
            .then(feed => {
                comic.episodes = getEpisodesFromFeed(feed)
                //todo: save this shit to the db before downloading, god damnit
                downloadAndSave(comic)
            })
            .catch(err => debug(err))
    })
}

/*
 * Goes through XML feed and returns list of episodes
 */
function getEpisodesFromFeed(xmlFeed) {
    const episodes = []
    const $ = cheerio.load(xmlFeed, {xmlMode: true})

    $('item').each(function () {
        const $item = $(this)
        const $content = cheerio.load($item.find('content\\:encoded').text())
        const rawDate = $item.find('pubDate').text()

        const episode = new Episode({
            date: moment(rawDate).format('Y-MM-DD'),
            path: '', //todo: put filename creation here
            url: $content('p img').attr('src')
        })
        episodes.push(episode)
    })

    return episodes
}

/*
 * Takes a Comic, determines filename for images and downloads
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
                        //todo: this save shit doesn't even fucking work
                        .then(() => dao.save(comic))
                        .catch(err => debug(err))
                }
            })
            .catch(err => debug(err))
    })
}