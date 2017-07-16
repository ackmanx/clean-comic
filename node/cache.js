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

        fetch.getFeed(comic.rss)
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
    const headRequests = []

    comic.episodes.forEach(episode => {
        if (episode.hasFileInfo) {
            debug(`Episode ${episode.date} file path info already exists. Skipping HEAD for file path info`)
        }
        else {
            const promise = fetch.head(episode.url)
                .then(response => {
                    episode.extension = mime.extension(response['content-type'])
                    episode.folderName = sanitize(comic.name).replace(/ /g, '_')
                    episode.fileName = episode.date
                    episode.localPath = `/images/${episode.folderName}/${episode.fileName}.${episode.extension}`
                    episode.hasFileInfo = true
                })
                .catch(err => debug(err))
            headRequests.push(promise)
        }
    })

    debug(`Waiting for ${headRequests.length} HEAD requests to resolve before saving ${comic.name} to database`)

    Promise.all(headRequests)
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
        downloadAndSave(comic)
    })
}

/*
 * Takes a Comic and downloads the episodes, saving the status to the database
 */
function downloadAndSave(comic) {
    const getRequests = []

    comic.episodes.forEach(episode => {
        if (episode.isDownloaded) {
            debug(`Episode ${episode.date} is already downloaded. Skipping.`)
        }
        else {
            const promise = fetch.downloadImage(episode)
                .then(response => episode.isDownloaded = true)
            getRequests.push(promise)
        }
    })

    debug(`Waiting for ${getRequests.length} GET requests to resolve before saving ${comic.name} to database`)

    Promise.all(getRequests)
        .then(() => dao.save(comic))
        .catch(err => debug(err))
}
