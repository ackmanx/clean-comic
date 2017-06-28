const FeedParser = require('feedparser')
const request = require('request')
const cheerio = require('cheerio')

const dirty = require('dirty')
const db = dirty('../dirty.db')

let req
let feedparser

exports.getImageUrlsForComic = function (id) {
    let rss
    db.forEach((pk, entry) => {
        if (entry.id === Number(id)) {
            rss = entry.rss
        }
    })

    feedparser = new FeedParser()
    req = request(rss)

    req.on('error', function (error) {
        console.error(error)
    })

    req.on('response', function (res) {
        const stream = this // `this` is `req`, which is a stream

        if (res.statusCode !== 200) {
            this.emit('error', new Error('Bad status code'))
        }
        else {
            stream.pipe(feedparser)
        }
    })

    feedparser.on('error', function (error) {
        console.error(error)
    })

    feedparser.on('readable', function () {
        const stream = this //`this` is `feedparser`, which is a stream
        const meta = this.meta //**NOTE** the "meta" is always available in the context of the feedparser instance
        let item

        while (item = stream.read()) {
            const $ = cheerio.load(item.description)
            console.warn($('p img').attr('src'))
        }
    })
}
