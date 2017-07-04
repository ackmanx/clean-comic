//Library includes
const debug = require('debug')('CleanComic:routes')
const express = require('express')
const router = express.Router()
const dirty = require('dirty')
const db = dirty(require('./globals').DB_PATH)

/*
 * Gets list of comic names and IDs
 * Returns object
 */
router.get('/comics', function (req, res, next) {
    const comics = []
    db.forEach((id, entry) => comics.push({
        id: entry.id,
        name: entry.name
    }))
    res.send(comics)
})

/*
 * Gets list of comic images with dates
 * Returns object
 */
router.get('/comic/:id', function (req, res, next) {
    const id = req.params.id
    const comics = [
        {date: 'date here', url: '/images/0_2017-6-7.jpg'},
        {date: 'date here', url: '/images/0_2017-6-12.jpg'},
        {date: 'date here', url: '/images/0_2017-6-14.jpg'},
    ]
    res.send(comics)
})

module.exports = router
