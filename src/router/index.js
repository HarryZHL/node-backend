const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const router = new Router()
router.get('/getEvents', async ctx => {
  try {
    const body = {
      status: 200,
      success: true,
      data: null,
      msg: 'success'
    }
    const { file } = ctx.query
    if (!file) {
      ctx.status = 500
      ctx.body = {
        status: 500,
        success: false,
        data: null,
        msg: `缺少指定file`
      }
      return
    }
    const recordFolder = path.join(__dirname, '../../record')
    const data = fs.readFileSync(path.join(recordFolder, file))
    body.data = JSON.parse(data.toString())
    ctx.status = 200
    ctx.body = body
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      success: false,
      data: null,
      msg: error
    }
  }
})
router.post('/saveEvents', async ctx => {
  try {
    const body = {
      status: 200,
      success: true,
      data: null,
      msg: 'success'
    }
    const recordFolder = path.join(__dirname, '../../record')
    const { file, event } = ctx.request.body
    if (!file) {
      ctx.status = 500
      ctx.body = {
        status: 500,
        success: false,
        data: null,
        msg: `缺少指定file`
      }
      return
    }
    async function writefile () {
      return new Promise((resolve, reject) => {
        fs.readdir(recordFolder, (err, files) => {
          if (files.indexOf(file) === -1) {
            console.log(`创建新文件: ${file}`)
            fs.writeFileSync(path.join(recordFolder, file), '')
          }
          const data = fs.readFileSync(path.join(recordFolder, file))
          const dataStr = data.toString()
          const fileJson = dataStr ? JSON.parse(dataStr) : {}
          fileJson.data = fileJson.data || []
          fileJson.data.push(...event)
          fileJson.total = fileJson.data.length
          const fileStr = JSON.stringify(fileJson)
          fs.writeFileSync(path.join(recordFolder, file), fileStr)
          resolve()
        })
      })
    }
    await writefile()
    const ids = event.map(item => item.count)
    const data = ids.join(',')
    body.data = data
    ctx.status = 200
    ctx.body = body
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      success: false,
      data: null,
      msg: error
    }
  }
})
router.all('/events', async ctx => {
  ctx.websocket.on('message', async message => {
    console.log('====' + message + '======')
    const msg = JSON.parse(message)
    const recordFolder = path.join(__dirname, '../../record')
    async function writefile () {
      return new Promise((resolve, reject) => {
        fs.readdir(recordFolder, (err, files) => {
          if (files.indexOf('wstest.json') === -1) {
            console.log(`创建新文件: wstest.json`)
            fs.writeFileSync(path.join(recordFolder, 'wstest.json'), '')
          }
          const data = fs.readFileSync(path.join(recordFolder, 'wstest.json'))
          const dataStr = data.toString()
          const fileJson = dataStr ? JSON.parse(dataStr) : {}
          fileJson.data = fileJson.data || []
          const event = msg.filter(item => item.type !== 5)
          fileJson.data.push(...event)
          fileJson.total = fileJson.data.length
          const fileStr = JSON.stringify(fileJson)
          fs.writeFileSync(path.join(recordFolder, 'wstest.json'), fileStr)
          resolve()
        })
      })
    }
    await writefile()
    let isGetBiz
    const idList = msg.map(item => {
      if(item.type === 5) {
        isGetBiz = true
        return JSON.stringify({iSeeBiz: 'testFromNode'})
      } else {
        isGetBiz = false
        return item.count
      }
    })
    ctx.websocket.send(idList.join(','))
  })
})
module.exports = router
