var path = require('path')
var xtpl = require('node-xtemplate')

function merge (target, source) {
  for (var key in source) {
    target[key] = source[key]
  }
}

function xtplRender (filename, data, option) {
  return new Promise(function (resolve, reject) {
    xtpl.render(filename, data, option, function (err, result) {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = function (option) {
  option = option || {}
  option.extname = option.extname || 'xtpl'

  async function render (filename, data, output) {
    output = output === undefined ? true : output

    // merge koa ctx.state, notice: koa < 0.14.0 have no ctx.state
    var context = {}
    merge(context, this.state || {})
    merge(context, data)

    var fullPath = path.isAbsolute(filename)
      ? filename
      : path.resolve(option.root, filename + '.' + option.extname)

    var html = await xtplRender(fullPath, context, option)

    if (output) {
      this.type = 'html'
      this.body = html
    }
    return html
  }
  return async function (ctx, next) {
    ctx.render = render
    await next()
  }
}
