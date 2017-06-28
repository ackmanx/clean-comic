const express = require('express')
const router = express.Router()
const service = require('./service')

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
    const comics = service.getImageUrlsForComic(id)
    res.send(comics)
})

module.exports = router

// {
//     date: 'Friday, January Go Fuck Yourself',
//     url: '/images/cyanide-and-happiness/test-image-tall.jpg'
// }