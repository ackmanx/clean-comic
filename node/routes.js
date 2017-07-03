const express = require('express')
const router = express.Router()
const service = require('./service')
const cheerio = require('cheerio')
const dirty = require('dirty')
const fs = require('fs')
const path = require('path')
const url = require('url')
const http = require('http')
const moment = require('moment')

const db = dirty('../dirty.db')

router.get('/comics', function (req, res, next) {
    const comics = []
    db.forEach((id, entry) => comics.push({
        id: entry.id,
        name: entry.name
    }))
    res.send(comics)
})

router.get('/comic/:id', function (req, res, next) {
    const id = req.params.id

    service.fetchFeedForId(id)
        .then(function (response) {
            const comics = parseFeedResponse(id, response)
            const cachedComics = cacheImages(comics)
            res.send(cachedComics)
        })
        .catch(function (error) {
            console.error(error)
        })
})

function parseFeedResponse(id, response) {
    const comics = []
    const $ = cheerio.load(response, {xmlMode: true})

    $('item').each(function (index) {
        const $item = $(this)
        const $content = cheerio.load($item.find('content\\:encoded').text())

        let comic = {
            id: id,
            date: $item.find('pubDate').text(),
            url: $content('p img').attr('src')
        }

        comics.push(comic)
    })

    return comics
}

/*
 * Input Contract:
 * [{
 *   id: database id for comic,
 *   date: any string date,
 *   url: publicly available url to image
 * }]
 *
 * Output Contract:
 * [{
 *   date: input date,
 *   url: relative url to image on file system
 * }]
 */
function cacheImages(comics) {
    const cachedComics = []

    comics.forEach(comic => {
        const date = moment(comic.date).format('Y-M-D')
        const imageName = `#${comic.id}_${date}.jpg`
        const saveLocation = path.join(__dirname, '..', 'public', 'images', imageName)
        const parsedUrl = url.parse(comic.url)

        if (fs.existsSync(saveLocation)) return

        http.get({host: parsedUrl.host, path: parsedUrl.pathname}, res => {
            const chunks = []
            res.on('data', chunk => chunks.push(chunk))
            res.on('end', () => {
                const buffer = Buffer.concat(chunks)
                fs.writeFile(saveLocation, buffer, (err) => {
                    if (err) throw err
                })
                cachedComics.push({
                    date: date,
                    url: `/images/${imageName}`
                })
            })
        })
    })

    return cachedComics
}

module.exports = router
