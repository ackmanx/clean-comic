const express = require('express')
const router = express.Router()
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
    let comics = []

    if (id < 3) {
        comics.push({
            date: 'Tuesday, January Go Fuck Yourself',
            url: '/images/cyanide-and-happiness/test-image-small.jpg'
        })
    }
    else {
        comics.push({
            date: 'Friday, January Go Fuck Yourself',
            url: '/images/cyanide-and-happiness/test-image-tall.jpg'
        })
    }

    res.send(comics)
})

module.exports = router
