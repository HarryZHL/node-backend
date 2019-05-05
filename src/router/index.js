const Router = require('koa-router')
const fs = require('fs')
const path = require('path')
const router = new Router()
router.post('/saveEvents', async ctx => {
  try {
    const body = {
      status: 200,
      success: true,
      data: null,
      msg: 'success'
    }
    const recordFolder = path.join(__dirname, '../record')
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
          fileJson.data.push(event)
          fileJson.total = fileJson.data.length
          const fileStr = JSON.stringify(fileJson)
          fs.writeFileSync(path.join(recordFolder, file), fileStr)
          resolve()
        })
      })
    }
    await writefile()
    ctx.status = 200
    ctx.body = body
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      status: 500,
      success: false,
      data: error,
      msg: `error`
    }
  }
})
module.exports = router
