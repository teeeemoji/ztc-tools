'use strict'

const path = require('path')
const fs = require('fs')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const resolveCwd = require('../resolveCwd')
const {info, debugLog, successLog} = require('../consoleLog')

const getWebpackCommonConfig = require('./getWebpackCommonConfig')

const getEntryAndHtmlPlugins = require('./getEntry')


const cwd = process.cwd()

function generateWebpackConfig({common, inlineSourceMap}) {
  const plugins = [new ProgressBarPlugin(), new webpack.HotModuleReplacementPlugin()]
  const {entry, htmlPlugins} = getEntryAndHtmlPlugins()

  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css'
    })
  )
  if (common) {
    plugins.push(
      // TODO: what is this plugin do @zhangtingcen
      new webpack.optimize.CommonsChunkPlugin({
        name: 'common',
        filename: 'common.js'
      })
    )
  }
  plugins.push(...htmlPlugins)

  return {
    // TODO mode 应该设置成? @zhangtingcen
    mode: 'development',

    devtool: inlineSourceMap ? '#inline-source-map' : '#source-map',

    resolveLoader: getWebpackCommonConfig.getResolveLoader(),

    entry,

    output: {
      path: resolveCwd('build'),
      filename: '[name].bundle.js'
    },

    module: {
      noParse: [/moment.js/],
      rules: getWebpackCommonConfig.getLoaders().concat(getWebpackCommonConfig.getCssLoaders(true))
    },

    resolve: getWebpackCommonConfig.getResolve(),

    plugins
  }
}

function getWebpackConfig(options = {}) {
  const {common = false, inlineSourceMap = true} = options

  let webpackConfig = generateWebpackConfig({common, inlineSourceMap})

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

  if (fs.existsSync(path.join(cwd, 'webpack.config.js'))) {
    return require(path.join(cwd, 'webpack.config.js'))(webpackConfig)
  }

  return webpackConfig
}

function getWebpackCompiler(options = {}) {
  const webpackConfig = getWebpackConfig(options)

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

  return compiler
}

module.exports = {
  getWebpackConfig,
  getWebpackCompiler
}
