var path = require('path')
var Koa = require('koa')

var xtpl = require('../')

var app = new Koa()

app.use(xtpl({
  root: path.join(__dirname, 'views'),
  extname: 'html',
  commands: {
    timestamp: function (scope, options, buffer) {
      buffer.write(Date.now())
    }
  }
}))

app.use(async function (ctx) {
  var html = await ctx.render('demo', { title: new Date() }, false)
  ctx.body = html
})

app.listen(3000, function (err) {
  if (err) throw err
  console.log('server is running @ http://localhost:3000/')
})
