const path = require('path')

//Because this will always be the folder `node` we know going up one will always be root
const projectRoot = path.join(__dirname, '..')

exports.ROOT = projectRoot
exports.DB_PATH = path.join(projectRoot, 'data', 'database.db')
exports.IMAGES_ROOT = path.join(projectRoot, 'public', 'images')
