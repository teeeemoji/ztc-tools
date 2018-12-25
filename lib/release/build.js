'use strict'

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const {getWebpackCompiler} = require('../utils/webpack-utils/getWebpackCompiler')
const {info, successLog, errorLog} = require('../utils/consoleLog')

const cwd = process.cwd()

const root = cwd

module.exports = function () {
  let compiler = getWebpackCompiler()

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
