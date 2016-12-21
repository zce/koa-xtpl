var path = require('path')
var xtpl = require('node-xtemplate')

function merge (target, source) {
  for (var key in source) {
    target[key] = source[key]
  }
}

function xtplRender (filename, data, option) {
  return function (done) {
    xtpl.render(filename, data, option, done)
  }
}

module.exports = function (option) {
  option = option || {}
  option.extname = option.extname || 'xtpl'

  function *render (filename, data, output) {
    output = output === undefined ? true : output

    // merge koa ctx.state, notice: koa < 0.14.0 have no ctx.state
    var context = {}
    merge(context, this.state || {})
    merge(context, data)

    var fullPath = path.isAbsolute(filename)
      ? filename
      : path.resolve(option.root, filename + '.' + option.extname)

    var html = yield xtplRender(fullPath, context, option)

    if (output) {
      this.type = 'html'
      this.body = html
    }
    return html
  }
  return function *(next) {
    this.render = render
    yield next
  }
}
