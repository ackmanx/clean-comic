const debug = require('debug')('CleanComic:server')
const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const lessMiddleware = require('less-middleware')
const dirty = require('dirty')


//----------------//----------------//----------------//----------------//----------------
// Express setup
//----------------//----------------//----------------//----------------//----------------
const app = express()
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser())
app.use(lessMiddleware(path.join(__dirname, 'public')))

//For local dev we use webpack's dev server to host static resources
//For production use express to do the same
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'public')))
}


//----------------//----------------//----------------//----------------//----------------
// Database setup
//----------------//----------------//----------------//----------------//----------------
dirty(require('./node/globals').DB_PATH)
    .on('load', () => debug('Database loaded'))
    .on('error', () => debug(error))


//----------------//----------------//----------------//----------------//----------------
// Endpoint registrations
//----------------//----------------//----------------//----------------//----------------
app.use(require('./node/routes'))


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
