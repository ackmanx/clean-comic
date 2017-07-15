/*
 * This script will build the database file from scratch
 * It will delete the existing database and re-create it
 * To add new comics to the application, simply add to the list and re-create the database
 */

const dirty = require('dirty')
const fs = require('fs')
const globals = require('../node/globals')

const comics = [
    {
        name: 'Poorly Drawn Lines',
        rss: 'http://feeds.feedburner.com/PoorlyDrawnLines?format=xml',
        imgSelector: 'P-IMG',
        comics: []
    },
    {
        name: 'Invisible Bread',
        rss: 'http://feeds.feedburner.com/InvisibleBread?format=xml',
        imgSelector: 'P-IMG',
        comics: []
    },
    {
        name: 'Channelate',
        rss: 'http://feeds.feedburner.com/Channelate?format=xml',
        imgSelector: 'P-IMG',
        comics: []
    }
]

if (fs.existsSync(globals.DB_PATH)) {
    fs.unlinkSync(globals.DB_PATH)
}

const db = dirty(globals.DB_PATH)

comics.forEach((comic, index) => {
    comic.id = index
    db.set(index, comic)
})
