const requestPromise = require('request-promise-native')
const cheerio = require('cheerio')

requestPromise('http://feeds.feedburner.com/PoorlyDrawnLines?format=xml')
    .then(function (response) {
        const $ = cheerio.load(response, {xmlMode: true})
        $('item').each(function (index) {
            const $item = $(this)
            const $content = cheerio.load($item.find('content\\:encoded').text())
            $content('p img').attr('src')
        })
    })
    .catch(function (error) {
        console.error(error)
    })
