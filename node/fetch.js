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
 * Downloads image file from a URL, saving it to images root
 */
exports.downloadImage = function (url) {
    const options = {
        url: url,
        dest: globals.IMAGES_ROOT
    }

    download.image(options)
        .then(function () {
            debug(`image downloaded! ${JSON.stringify(options)}`)
        })
        .catch(function (err) {
            debug(`image download failed! ${JSON.stringify(options)}`)
            debug(err)
        })
}