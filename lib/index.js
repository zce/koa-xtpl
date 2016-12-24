var path = require('path')
var xtpl = require('node-xtemplate')

function merge (target, source) {
  for (var key in source) {
    target[key] = source[key]
  }
}

module.exports = function (options) {
  if (typeof options === 'string') {
    options = { root: options }
  }

  options = options || {}
  options.extname = options.extname || 'xtpl'

  xtpl.config(options)

  function render (name, data, output) {
    output = output === undefined ? true : output

    // merge koa ctx.state, notice: koa < 0.14.0 have no ctx.state
    var context = {}
    merge(context, this.state || {})
    merge(context, data)

    var fullPath = path.isAbsolute(name)
      ? name
      : path.resolve(options.root, name + '.' + options.extname)

    var that = this
    return xtpl.render(fullPath, context).then(function (result) {
      if (output) {
        that.type = 'text/html'
        that.body = result
      }
      return result
    })
  }

  return function (ctx, next) {
    ctx.render = render
    return next()
  }
}
