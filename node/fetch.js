//Library includes
const debug = require('debug')('CleanComic:fetch')
const requestPromise = require('request-promise-native');
const dirty = require('dirty')
const db = dirty(require('./globals').DB_PATH)

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

exports.fetchComic = function fetchComic(comicId) {
    return dao.find(comicId)
}
