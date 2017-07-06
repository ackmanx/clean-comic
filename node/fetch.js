const globals = require('./globals')

//Library includes
const debug = require('debug')('CleanComic:fetch')
const requestPromise = require('request-promise-native')
const download = require('image-downloader')
const dirty = require('dirty')
const db = dirty(globals.DB_PATH)

//Module includes
const dao = require('./dao')

/*
 * Downloads image file from a URL, saving it to images root
 */
exports.downloadImage = function (url, comicName) {
    if (comicName[0] !== '/') {
        comicName = `/${comicName}`
    }

    const options = {
        url: url,
        dest: globals.IMAGES_ROOT
    }

    return download.image(options)
        .catch(function (err) {
            debug(`image download failed! ${JSON.stringify(options)}`)
            debug(err)
        })
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
 * Gets a comic record from the DB and makes a request for the RSS feed in the record
 * Returns a promise for the feed request
 */
exports.fetchFeedForId = function fetchFeedForId(id) {
    let rssUrl

    db.forEach((pk, entry) => {
        if (entry.id === Number(id)) {
            rssUrl = entry.rss
        }
    })

    if (!rssUrl) {
        //todo: this will kill the node server so don't do it
        throw new Error('How did you get a comic ID for one that does not exist?')
    }

    return requestPromise(rssUrl)
}