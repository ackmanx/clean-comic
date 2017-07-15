/*
 * This script will build the database file from scratch
 * It will delete the existing database and re-create it
 * To add a new comic to the application, simply add to this list and re-create the database by running this file
 */

const dirty = require('dirty')
const fs = require('fs')
const globals = require('../node/globals')
const Comic = require('../node/dto/Comic.js')

if (fs.existsSync(globals.DB_PATH)) {
    fs.unlinkSync(globals.DB_PATH)
}

const db = dirty(globals.DB_PATH);

[
    new Comic({
        name: 'Poorly Drawn Lines',
        rss: 'http://feeds.feedburner.com/PoorlyDrawnLines?format=xml',
        imgSelector: 'P-IMG'
    }),
    new Comic({
        name: 'Invisible Bread',
        rss: 'http://feeds.feedburner.com/InvisibleBread?format=xml',
        imgSelector: 'P-IMG'
    }),
    new Comic({
        name: 'Channelate',
        rss: 'http://feeds.feedburner.com/Channelate?format=xml',
        imgSelector: 'P-IMG'
    })
].forEach((comic, index) => {
    comic.id = index
    db.set(index, comic)
})
