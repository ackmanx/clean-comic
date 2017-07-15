//Library includes
const debug = require('debug')('CleanComic:dao')
const dirty = require('dirty')
const db = dirty(require('./globals').DB_PATH)

exports.find = function (comicId) {
    let comic
    comicId = Number.parseInt(comicId)

    if (isNaN(comicId)) {
        debug(`Comic ID ${comicId} is not a number. Aborting find.`)
        return
    }

    db.forEach((id, entry) => {
        if (id === comicId) {
            comic = entry
        }
    })

    return comic
}

exports.getAllComics = function () {
    let comics = []
    db.forEach((id, entry) => comics.push(entry))
    return comics
}

exports.save = function (comic) {
    //todo: pretty sure this isn't working right... saving comic without an id
    db.set(comic.id, comic)
}