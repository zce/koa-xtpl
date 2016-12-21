var path = require('path')
var Koa = require('koa')
var xtpl = require('../')
var app = new Koa()

app.use(xtpl({ root: path.join(__dirname, 'views') }))

app.use(async function (ctx) {
  var html = await ctx.render('demo', { title: new Date() }, false)
  // console.log(html)
  ctx.body = html
})

app.listen(3000)
