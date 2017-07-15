const Episode = function (options) {
    const {date, fileName, folderName, url} = options

    if (!date) throw 'date required'
    if (!fileName) throw 'fileName required'
    if (!folderName) throw 'folderName required'
    if (!url) throw 'url required'

    return {
        date, //string, moment format Y-MM-DD
        folderName, //string
        fileName, //string
        url //string, absolute external url
    }
}

module.exports = Episode
