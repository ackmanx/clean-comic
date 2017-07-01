const express = require('express')
const router = express.Router()
const service = require('./service')
const cheerio = require('cheerio')
const dirty = require('dirty')

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
    service.getImageUrlsForComic(id)
        .then(function (response) {
            const comics = []
            const $ = cheerio.load(response, {xmlMode: true})

            $('item').each(function (index) {
                const $item = $(this)
                const $content = cheerio.load($item.find('content\\:encoded').text())
                let comic = {
                    date: $item.find('pubDate').text(),
                    url: $content('p img').attr('src')
                }
                comics.push(comic)
            })

            res.send(comics)
        })
        .catch(function (error) {
            console.error(error)
        })
})

module.exports = router

// {
//     date: 'Friday, January Go Fuck Yourself',
//     url: '/images/cyanide-and-happiness/test-image-tall.jpg'
// }