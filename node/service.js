const requestPromise = require('request-promise-native');
const cheerio = require('cheerio')
const dirty = require('dirty')

const db = dirty('../dirty.db')

function getImageUrlsForComic(id) {
    let rssUrl
    db.forEach((pk, entry) => {
        if (entry.id === Number(id)) {
            rssUrl = entry.rss
        }
    })

    return requestPromise(rssUrl)
}

exports.getImageUrlsForComic = getImageUrlsForComic
