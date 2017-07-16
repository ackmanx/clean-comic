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

/*
 * Downloads image file from a URL, saving it to images root
 */
exports.downloadImage = function (episode) {
    const absoluteFolder = path.join(globals.IMAGES_ROOT, episode.folderName)

    if (!fs.existsSync(absoluteFolder)) {
        debug(`Folder ${absoluteFolder} does not exist. Creating.`)
        fs.mkdirSync(absoluteFolder)
    }

    const options = {url: episode.url, dest: path.join(absoluteFolder, episode.fileName)}

    debug(`Downloading ${episode.folderName}/${episode.fileName} at ${episode.url}`)

    return download.image(options)
        .then(() => debug(`Image ${options.url} successfully downloaded!`))
        .catch(function (err) {
            debug(`Image download failed! ${JSON.stringify(options)}`)
            debug(err)
        })
}

/*
 * Make a generic HEAD request
 */
exports.head = function (url) {
    debug(`HEAD request sent for ${url}`)
    return requestPromise(url, {method: 'HEAD'})
        .catch(err => debug(err))
}

/*
 * Makes a request for the RSS feed
 * Returns a promise for the feed request
 */
exports.getFeed = function fetchFeedForId(rssUrl) {
    return requestPromise(rssUrl)
}