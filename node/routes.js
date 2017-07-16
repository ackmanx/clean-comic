//Library includes
const debug = require('debug')('CleanComic:routes')
const router = require('express').Router()

//Module includes
const dao = require('./dao')
const cache = require('./cache')

/*
 * Gets list of comic names and IDs
 * Returns array of objects
 */
router.get('/comics', function (req, res, next) {
    res.send(dao.getComicsNameList())
})

/*
 * Gets list of comic images with dates for a particular comic
 * Returns array of objects
 */
router.get('/comic/:id', function (req, res, next) {
    const id = req.params.id
    res.send(dao.find(id))
})

/*
 * Forces the application to check all feeds and download new comics
 */
router.post('/update', function (req, res, next) {
    cache.update()
    res.send('Updating all feeds now. Check server logs for progress.')
})

module.exports = router
