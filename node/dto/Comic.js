const Comic = function (options) {
    const {id, name, rss, imgSelector, episodes = []} = options

    if (isNaN(Number.parseInt(id))) throw 'id required'
    if (!name) throw 'name required'
    if (!rss) throw 'rss required'
    if (!imgSelector) throw 'imgSelector required'

    return {
        id, //integer
        name, //string
        rss, //string
        imgSelector, //string
        episodes //array
    }
}

module.exports = Comic
