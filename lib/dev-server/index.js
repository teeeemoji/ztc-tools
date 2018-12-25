'use strict'

const path = require('path')
const fs = require('fs')
const Koa = require('koa')
const Router = require('koa-router')
const serve = require('koa-static')
const koaBody = require('koa-body')
const webpackMiddleware = require('koa-webpack-dev-middleware')
const webpackHotMiddleware = require('koa-webpack-hot-middleware')
const {getWebpackCompiler} = require('../utils/webpack-utils/getWebpackCompiler')

const cwd = process.cwd()

const root = cwd

module.exports = function (app) {
  app = app || new Koa()

  app.use(
    require('koa-favicon')(path.join(__dirname, '../../assets/favicon.ico'))
  )
  // TODO: @zhangtingcen 下面这个文章不错
  // https://imququ.com/post/four-ways-to-post-data-in-http.html
  // parse application/x-www-form-urlencoded
  app.use(
    koaBody({
      formidable: {uploadDir: path.join(cwd, 'tmp')},
      multipart: true
    })
  )

  let router = new Router()
  let routes = require('./router/routes')
  routes(router)
  app.use(router.routes()).use(router.allowedMethods())


  const publicPath = '/'
  const compiler = getWebpackCompiler({
    common: false,
    inlineSourceMap: true
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
  app.use(webpackHotMiddleware(compiler))

  // 这里是处理静态资源
  app.use(
    serve(root, {
      hidden: true
    })
  )

  return app
}
