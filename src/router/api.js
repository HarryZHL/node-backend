const service = require('../mongoose/service')

module.exports = function createApi(router) {
  router.post('/saveEvents', function(req, res) {
    const list = req.body.list
    service.saveMany(list, records => {
      console.log('%d record inserted success!', records.length)
      res.status(200).end('ok')
    })
  })
  router.get('/getEvents', function(req, res) {
    service.getEvents(records => {
      res.status(200).json(records)
    })
  })
}
