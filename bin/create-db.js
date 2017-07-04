/*
 * This script will build the database file from scratch
 * It will delete the existing database and re-create it
 * To add new comics to the application, simply add to the list and re-create the database
 */

const dirty = require('dirty')
const fs = require('fs')
const globals = require('../node/globals')

//for development, bootstrap some comics that will otherwise come from the background service
const poorlyBootstrap = [
    {date: '2017-06-26', read: false, path: '/images/poorly-drawn-lines/2017-6-7.jpg'},
    {date: '2017-06-27', read: false, path: '/images/poorly-drawn-lines/2017-6-12.jpg'},
    {date: '2017-06-28', read: false, path: '/images/poorly-drawn-lines/2017-6-14.jpg'},
]

const invisibleBootstrap = [
    {date: '2017-06-26', read: false, path: '/images/invisible-bread/2017-06-06.png'},
    {date: '2017-06-27', read: false, path: '/images/invisible-bread/2017-06-14.png'},
    {date: '2017-06-28', read: false, path: '/images/invisible-bread/2017-07-03.png'},
]

const channelateBootstrap = [
    {date: '2017-06-26', read: false, path: '/images/channelate/2017-06-26.png'},
    {date: '2017-06-27', read: false, path: '/images/channelate/2017-06-27.png'},
    {date: '2017-06-28', read: false, path: '/images/channelate/2017-06-28.png'},
]

const comics = [
    {
        name: 'Poorly Drawn Lines',
        rss: 'http://feeds.feedburner.com/PoorlyDrawnLines?format=xml',
        imgSelector: 'P-IMG',
        comics: poorlyBootstrap
    },
    {
        name: 'Invisible Bread',
        rss: 'http://feeds.feedburner.com/InvisibleBread?format=xml',
        imgSelector: 'P-IMG',
        comics: invisibleBootstrap
    },
    {
        name: 'Channelate',
        rss: 'http://feeds.feedburner.com/Channelate?format=xml',
        imgSelector: 'P-IMG',
        comics: channelateBootstrap
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
