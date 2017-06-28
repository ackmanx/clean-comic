const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const lessMiddleware = require('less-middleware')
const dirty = require('dirty')
const debug = require('debug')('CleanComic:server')

const C = require('./constants')

const app = express()


//----------------//----------------//----------------//----------------//----------------
// Express setup
//----------------//----------------//----------------//----------------//----------------
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(lessMiddleware(path.join(__dirname, 'public')))

//todo: do i need to use this for prod only?
// app.use(express.static(path.join(__dirname, 'public')))


//----------------//----------------//----------------//----------------//----------------
// Database setup
//----------------//----------------//----------------//----------------//----------------
dirty(C.DB_PATH)
    .on('load', () => debug('Database loaded'))
    .on('error', () => debug(error))


//----------------//----------------//----------------//----------------//----------------
// Endpoint registrations
//----------------//----------------//----------------//----------------//----------------
app.use(require('./routes'))


//----------------//----------------//----------------//----------------//----------------
// Error handlers
//----------------//----------------//----------------//----------------//----------------
app.use(function (req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})

if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500)
        res.send({
            message: err.message,
            error: err
        })
    })
}

app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.send({
        message: err.message,
        error: {}
    })
})

module.exports = app
