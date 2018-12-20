'use strict'

const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const serve = require('koa-static')
const serveIndex = require('koa-serve-index')
// const router = require('koa-router');
const koaBody = require('koa-body')
const webpack = require('webpack')
const webpackMiddleware = require('koa-webpack-dev-middleware')
const getWebpackConfig = require('../getWebpackConfig')
const {info, successLog} = require('../console-log')

const cwd = process.cwd()

const root = cwd

module.exports = function (app) {
  app = app || new Koa()

  const root = cwd

  app.use(
    require('koa-favicon')(path.join(__dirname, '../../public/favicon.ico'))
  )
  // TODO: @zhangtingcen 下面这个文章不错
  // https://imququ.com/post/four-ways-to-post-data-in-http.html
  // parse application/x-www-form-urlencoded
  app.use(
    koaBody({
      formidable: { uploadDir: path.join(cwd, 'tmp') },
      multipart: true
    })
  )
  // app.use(router(app));

  // TODO: getWebpackConfig @zhangtingcen
  let webpackConfig = getWebpackConfig({
    common: false,
    inlineSourceMap: true
  })

  // TODO: webpack console output plugin @zhangtingcen
  webpackConfig.plugins.push(
    new webpack.ProgressPlugin((percentage, msg) => {
      const stream = process.stderr
      if (stream.isTTY && percentage < 0.71) {
        stream.cursorTo(0)
        stream.write(info(msg))
        stream.clearLine(1)
      } else if (percentage === 1) {
        successLog('\nwebpack: bundle build is now finished.')
      }
    })
  )
  const publicPath = '/'
  if (fs.existsSync(path.join(cwd, 'webpack.config.js'))) {
    webpackConfig = require(path.join(cwd, 'webpack.config.js'))(webpackConfig)
  }

  const compiler = webpack(webpackConfig)

  compiler.plugin('done', stats => {
    if (stats.hasErrors()) {
      console.log(
        stats.toString({
          colors: true
        })
      )
    }
  })

  app.use(
    webpackMiddleware(compiler, {
      publicPath,
      hot: true,
      https: false,
      quiet: true,
      headers: {
        'Cache-control': 'no-cache'
      }
    })
  )
  // TODO later: 这里是列出目录 @zhangtingcen
  app.use(
    serveIndex(root, {
      hidden: true,
      view: 'details',
      icons: true,
      filter: filename => {
        return filename.indexOf('.') !== 0 && filename.indexOf('.js') < 0
      }
    })
  )
  // TODO later: 这里是处理静态资源 @zhangtingen
  app.use(
    serve(root, {
      hidden: true
    })
  )
  return app
}