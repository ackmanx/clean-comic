const Episode = function (options) {
    const {date, fileName, folderName, url, extension, isDownloaded, hasFileInfo} = options

    if (!date) throw 'date required'
    if (!url) throw 'url required'

    return {
        date, //string, moment format Y-MM-DD
        folderName, //string
        fileName, //string
        extension, //string
        url, //string, absolute external url
        isDownloaded, //boolean
        hasFileInfo, //boolean
    }
}

module.exports = Episode
