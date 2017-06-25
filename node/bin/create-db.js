const dirty = require('dirty')
const db = dirty('../dirty.db')

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

comics.forEach((comic, index) => {
    db.set(index, comic)
})
