const globals = require('./globals')

//Library includes
const debug = require('debug')('CleanComic:fetch')
const download = require('image-downloader')
const dirty = require('dirty')
const db = dirty(globals.DB_PATH)
const fs = require('fs')
const path = require('path')
const requestPromise = require('request-promise-native')

//Module includes
const dao = require('./dao')

/*
 * Downloads image file from a URL, saving it to images root
 */
exports.downloadImage = function (folder, file, url) {

    const absoluteFolder = path.join(globals.IMAGES_ROOT, folder)
    const absoluteFile = path.join(globals.IMAGES_ROOT, folder, file)

    if (fs.existsSync(absoluteFile)) {
        debug(`File ${absoluteFile} already exists. Skipping.`)
        return
    }

    if (!fs.existsSync(absoluteFolder)) {
        fs.mkdirSync(absoluteFolder)
    }

    const options = {url: url, dest: absoluteFile}
    download.image(options)
        .catch(function (err) {
            debug(`Image download failed! ${JSON.stringify(options)}`)
            debug(err)
        })
}

/*
 * Make a HEAD request
 */
exports.getHeaders = function (url) {
    return requestPromise(url, {method: 'HEAD'})
        .catch(err => console.error(err))
}

/*
 * Returns a list of all comics
 */
exports.fetchComicsList = function fetchComicsList() {
    const comics = []
    db.forEach((id, entry) => comics.push({
        id: entry.id,
        name: entry.name
    }))
    return comics
}

/*
 * Returns a single comic object
 */
exports.fetchComic = function fetchComic(comicId) {
    return dao.find(comicId)
}

/*
 * Makes a request for the RSS feed
 * Returns a promise for the feed request
 */
exports.fetchFeed = function fetchFeedForId(rssUrl) {
    return requestPromise(rssUrl)
}