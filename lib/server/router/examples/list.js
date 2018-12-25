/**
 * @author teeeemoji
 * @type {"path"}
 * @description list demos in examples folder
 */
let path = require('path')
let fs = require('fs')
let views = require('koa-views')
let router = require('koa-router')()

let exampleFilesFilter = filename => filename.indexOf('.js') > 0
let getExampleName = filename => filename.slice(0, -3)

router.use(views(path.join(__dirname, './views'), {
  extension: 'ejs'
}))

router.all('/', async function (ctx, next) {
  let dir = `${process.cwd()}/examples/`

  let stat
  try {
    stat = fs.statSync(dir)
  } catch (err) {
    if (err && err.code === 'ENOENT') {
      next()
      return
    }
    err.status = err.code === 'ENAMETOOLONG'
      ? 414
      : 500
    throw err
  }
  if (!stat.isDirectory()) {
    next()
    return
  }

  let examples = fs.readdirSync(dir)

  examples = examples.filter(exampleFilesFilter).map(getExampleName)

  await ctx.render('examples', {
    examples
  })

})

module.exports = router.routes()
