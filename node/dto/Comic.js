const Comic = function (options) {
    const {name, rss, imgSelector, episodes = []} = options

    if (!name) throw 'name required'
    if (!rss) throw 'rss required'
    if (!imgSelector) throw 'imgSelector required'

    return {
        name, //string
        rss, //string
        imgSelector, //string
        episodes //array
    }
}

module.exports = Comic
