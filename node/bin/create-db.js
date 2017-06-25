const dirty = require('dirty')
const fs = require('fs')

const DB_PATH = '../dirty.db'
const comics = [
    {
        name: 'Poorly Drawn Lines',
        rss: 'http://feeds.feedburner.com/PoorlyDrawnLines?format=xml',
        imgSelector: 'P-IMG'
    },
    {
        name: 'Invisible Bread',
        rss: 'http://feeds.feedburner.com/InvisibleBread?format=xml',
        imgSelector: 'P-IMG'
    },
    {
        name: 'Channelate',
        rss: 'http://feeds.feedburner.com/Channelate?format=xml',
        imgSelector: 'P-IMG'
    },
    {
        name: 'Fowl Language',
        rss: 'http://www.fowllanguagecomics.com/feed/',
        imgSelector: 'P-IMG'
    },
    {
        name: 'Safely Endangered',
        rss: 'http://www.safelyendangered.com/feed/',
        imgSelector: 'P-IMG'
    },
    {
        name: 'War and Peas',
        rss: 'https://warandpeas.com/feed/',
        imgSelector: 'P-IMG'
    }
]

if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH)
}

const db = dirty(DB_PATH)

comics.forEach((comic, index) => {
    comic.id = index
    db.set(index, comic)
})
