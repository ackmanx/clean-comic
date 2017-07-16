/*
 * This script will build the database file from scratch
 * It will delete the existing database and re-create it
 * To add a new comic to the application, simply add to this list and re-create the database by running this file
 */

//Library includes
const dirty = require('dirty')
const fs = require('fs')

//Module includes
const globals = require('../node/globals')
const Comic = require('../node/dto/Comic.js')
const id = require('../node/idGenerator')

if (fs.existsSync(globals.DB_PATH)) {
    fs.unlinkSync(globals.DB_PATH)
}

const db = dirty(globals.DB_PATH);

[
    new Comic({
        id: id.next().value,
        name: 'Poorly Drawn Lines',
        rss: 'http://feeds.feedburner.com/PoorlyDrawnLines?format=xml',
        imgSelector: 'P-IMG'
    }),
    new Comic({
        id: id.next().value,
        name: 'Invisible Bread',
        rss: 'http://feeds.feedburner.com/InvisibleBread?format=xml',
        imgSelector: 'P-IMG'
    }),
    new Comic({
        id: id.next().value,
        name: 'Channelate',
        rss: 'http://feeds.feedburner.com/Channelate?format=xml',
        imgSelector: 'P-IMG'
    })
].forEach((comic) => {
    db.set(comic.id, comic)
})
