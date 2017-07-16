//Library includes
const debug = require('debug')('CleanComic:dao')
const dirty = require('dirty')
const db = dirty(require('./globals').DB_PATH)

//Module includes
const Comic = require('./dto/Comic')

/*
 * Find a single Comic object from the database and returns it
 */
exports.find = function find(comicId) {
    let comic
    comicId = Number.parseInt(comicId)

    if (isNaN(comicId)) {
        debug(`Comic ID ${comicId} is not a number. Aborting find.`)
        return
    }

    db.forEach((id, entry) => {
        if (id === comicId) {
            comic = new Comic(entry)
        }
    })

    return comic
}

/*
 * Returns a list of all comics
 */
exports.getComicsNameList = function fetchComicsList() {
    const list = []
    db.forEach((id, entry) => list.push({id: entry.id, name: entry.name}))
    return list
}

/*
 * Returns an array of all Comic objects in the database
 */
exports.getAllComics = function getAllComics() {
    let comics = []
    db.forEach((id, entry) => comics.push(new Comic(entry)))
    return comics
}

/*
 * Supposed to save a Comic object to the database using the comic ID as the PK
 */
exports.save = function save(comic) {
    //todo: pretty sure this isn't working right... saving comic without an id
    db.set(comic.id, comic)
}
