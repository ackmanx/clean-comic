let http = require('http'),
    fs = require('fs'),
    url = require('url'),
    path = require('path')

function blah(_href, _filepath) {

    http.get({
        host: parsedURL.host,
        path: parsedURL.pathname
    }, function (res) {
        let chunks = [];

        res.on('data', function (chunk) {
            chunks.push(chunk)
        })

        res.on('end', function () {
            const buffer = Buffer.concat(chunks)
            fs.writeFile(filepath, buffer, function (err) {
                if (err) throw err
                console.log('saved', filepath)
            })
        })

    })
}

blah('https://s-media-cache-ak0.pinimg.com/originals/14/5f/7a/145f7a8b5f1e31c7fbc31a37eebe2a32.jpg', path.join(__dirname, '..', '/public/images/test1.jpg'))
