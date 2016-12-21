var path = require('path')
var xtpl = require('node-xtemplate')

function merge (target, source) {
  for (var key in source) {
    target[key] = source[key]
  }
}

module.exports = function (options) {
  options = options || {}
  options.extname = options.extname || 'xtpl'

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
    return new Promise(function (resolve, reject) {
      xtpl.render(fullPath, context, options, function (err, result) {
        if (err) return reject(err)
        if (!output) return resolve(result)
        that.type = 'html'
        that.body = result
        resolve(result)
      })
    })
  }

  return function (ctx, next) {
    ctx.render = render
    return next()
  }
}
