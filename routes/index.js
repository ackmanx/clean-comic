const express = require('express')
const router = express.Router()

router.get('/test', function (req, res, next) {
    res.send({mykey: 'hey man'})
})

module.exports = router
