const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const moment = require('moment')
const app = new Koa()
const router = require('./src/router')
const PORT = 3030

app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

app.use(bodyParser({
  enableTypes: ['json', 'form', 'text'],
  formLimit: '5mb',
  textLimit: '5mb'
}));

app.use(async (ctx, next) => {

  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Methods', 'PUT,DELETE,POST,GET,OPTIONS');
  ctx.set('Access-Control-Max-Age', 3600 * 24)
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set('Access-Control-Allow-Headers', 'Authorization,Origin, X-Requested-With, Access-Control-Request-Headers, Access-Control-Request-Method, Content-Type, Accept')
  
  if (ctx.method === 'OPTIONS') {
    ctx.body = '';
  }

  console.log('------------------------------------------');
  // console.log('请求时间:' + moment(startTime).format('YYYY-MM-DD HH:mm:ss'));
  console.log('请求方法:' + ctx.request.method);
  console.log('请求地址:' + ctx.request.url);
  console.log('------------------------------------------');
  await next()
});

// app.use('/', router)
app.use(router.routes())

app.listen(PORT, function() {
  console.log('-------server started-------')
})
