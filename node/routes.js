//Library includes
const debug = require('debug')('CleanComic:routes')
const router = require('express').Router()
const fetch = require('./fetch')

/*
 * Gets list of comic names and IDs
 * Returns array of objects
 */
router.get('/comics', function (req, res, next) {
    res.send(fetch.fetchComicsList())
})

/*
 * Gets list of comic images with dates for a particular comic
 * Returns array of objects
 */
router.get('/comic/:id', function (req, res, next) {
    const id = req.params.id
    res.send(fetch.fetchComic(id))
})

module.exports = router
