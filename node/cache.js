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
exports.updateFeedCache = function cache() {
    debug('Running cache feed update')

    dao.getAllComics().forEach(comic => {
        debug(`Updating ${comic.name} with latest image URLs`)

        fetch.fetchFeed(comic.rss)
            .then(xml => {
                getEpisodesFromFeed(comic, xml)
                determineFilePathInfoAndSave(comic)
            })
            .catch(err => debug(err))
    })
}

/*
 * Goes through XML feed and builds new Episodes
 * Mutates passed Comic
 */
function getEpisodesFromFeed(comic, xmlFeed) {
    const $ = cheerio.load(xmlFeed, {xmlMode: true})

    $('item').each(function () {
        const $item = $(this)
        const $content = cheerio.load($item.find('content\\:encoded').text())
        const rawDate = $item.find('pubDate').text()

        const episode = new Episode({
            date: moment(rawDate).format('Y-MM-DD'),
            url: $content('p img').attr('src'),
            isDownloaded: false
        })

        comic.episodes.push(episode)
    })
}

/*
 * Builds folder name, file name, extension and adds to Episode
 * Mutates passed Comic and saves to database
 */
function determineFilePathInfoAndSave(comic) {
    const heads = []

    comic.episodes.forEach(episode => {
        if (episode.isDownloaded) {
            debug(`Episode ${episode.date} is already downloaded. Skipping HEAD for file path info`)
        }
        else {
            debug(`Getting file path info for ${episode.date} using HEAD request`)
            const promise = fetch.head(episode.url)
                .then(response => {
                    episode.extension = mime.extension(response['content-type'])
                    episode.folderName = sanitize(comic.name).replace(/ /g, '_')
                    episode.fileName = episode.date
                })
                .catch(err => debug(err))
            heads.push(promise)
        }
    })

    Promise.all(heads)
        .then(() => dao.save(comic))
        .catch(err => debug(err))
}

/*
 * Goes through each non-downloaded image record and downloads it to image cache
 */
exports.updateImageCache = function () {
    debug('Running cache image update')

    dao.getAllComics().forEach(comic => {
        debug(`Downloading new images for ${comic.name}`)
    })
}

// /*
//  * Takes a Comic, determines filename for images and downloads
//  */
// function downloadAndSave(comic) {
//     comic.episodes.forEach(episode => {
//
//         if (!episode.extension) {
//             fetch.head(episode.url)
//                 .then(response => {
//                     episode.extension = mime.extension(response['content-type'])
//                     episode.folderName = sanitize(comic.name).replace(/ /g, '_')
//                     episode.fileName = episode.date
//                     dao.save(comic)
//                 })
//                 .catch(err => debug(err))
//         }
//
//         const promise = fetch.downloadImage(folder, file, episode.url)
//
//         //Being we skip images we already have, no promise may be returned
//         if (promise) {
//             promise
//             //todo: this save shit doesn't even fucking work
//                 .then(() => dao.save(comic))
//                 .catch(err => debug(err))
//         }
//     })
// }
