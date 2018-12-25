'use strict'

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const getWebpackConfig = require('../utils/webpack-utils/getWebpackConfig')
const {info, successLog, errorLog} = require('../utils/consoleLog')

const cwd = process.cwd()

const root = cwd

module.exports = function () {
  let webpackConfig = getWebpackConfig({
    common: false,
    inlineSourceMap: true
  })

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

  compiler.run(function (err, stats) {
    if (err) {
      errorLog(err)
      errorLog(err.stack)
      return
    }

    if (stats.hasErrors()) {
      errorLog(stats.toString('errors-only'))
    }

    successLog('构建完成')

  })
}
