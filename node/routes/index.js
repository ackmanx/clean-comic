const express = require('express')
const router = express.Router()
const dirty = require('dirty')
const db = dirty('../dirty.db')

router.get('/comics', function (req, res, next) {
    const comics = []
    db.forEach((id, entry) => comics.push(entry))
    res.send(comics)
})

module.exports = router
