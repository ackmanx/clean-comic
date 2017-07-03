const requestPromise = require('request-promise-native');
const cheerio = require('cheerio')
const dirty = require('dirty')

const db = dirty('../dirty.db')

function fetchFeedForId(id) {
    let rssUrl

    db.forEach((pk, entry) => {
        if (entry.id === Number(id)) {
            rssUrl = entry.rss
        }
    })

    return requestPromise(rssUrl)
}

function fetchImage(imageUrl) {
    const options = {
        method: 'GET',
        uri: imageUrl,
        resolveWithFullResponse: true
    }

    return requestPromise(options)
}

exports.fetchFeedForId = fetchFeedForId
exports.fetchImage = fetchImage
