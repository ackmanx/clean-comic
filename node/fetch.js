//Library includes
const debug = require('debug')('CleanComic:fetch')
const requestPromise = require('request-promise-native');
const dirty = require('dirty')
const db = dirty(require('./globals').DB_PATH)

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
