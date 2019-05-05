const fs = require('fs')
const path = require('path')
module.exports = function createPageRouter(router) {
  router.get('/play', function(req, res) {
    res.header('Content-Type', 'text/html')
    res.status(200).end(fs.readFileSync(path.resolve(__dirname, '../html/index.html'), 'utf-8'))
  })
}
