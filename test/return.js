var path = require('path')
var Koa = require('koa')
var xtpl = require('../')
var app = Koa()

app.use(xtpl({ root: path.join(__dirname, 'views') }))

app.use(function *() {
  var html = yield this.render('demo', { title: new Date() }, false)
  // console.log(html)
  this.body = html
})

app.listen(3000)
