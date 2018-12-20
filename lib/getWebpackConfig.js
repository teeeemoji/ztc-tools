'use strict'

const path = require('path')
const resolveCwd = require('./resolveCwd')
const fs = require('fs')
const webpack = require('webpack')
const {debugLog} = require('./console-log')

const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const getWebpackCommonConfig = require('./getWebpackCommonConfig')

function getEntry() {
  const exampleDir = resolveCwd('examples')

  const files = fs.readdirSync(exampleDir)
  const entry = {}
  files.forEach(file => {
    const extname = path.extname(file)
    const name = path.basename(file, extname)
    if (extname === '.js' || extname === '.jsx' || extname === '.tsx' || extname === '.ts') {
      const htmlFile = path.join(exampleDir, `${name}.html`)
      // if (fs.existsSync(htmlFile)) {
      entry[`examples/${name}`] = [`./examples/${file}`]
      // }
    }
  })
  debugLog(JSON.stringify(entry, 2))
  return entry
}

const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = ({common, inlineSourceMap}) => {
  const plugins = [new ProgressBarPlugin()]
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
  plugins.push(new HtmlWebpackPlugin({
    title: 'ztc design component example',
    template: path.join(__dirname, '../views/default.html')
  }))
  return {
    // TODO mode 应该设置成? @zhangtingcen
    mode: 'development',

    devtool: inlineSourceMap ? '#inline-source-map' : '#source-map',

    resolveLoader: getWebpackCommonConfig.getResolveLoader(),

    entry: getEntry(),

    output: {
      path: resolveCwd('build'),
      filename: '[name].js'
    },

    module: {
      noParse: [/moment.js/],
      rules: getWebpackCommonConfig.getLoaders().concat(getWebpackCommonConfig.getCssLoaders(true))
    },

    resolve: getWebpackCommonConfig.getResolve(),

    plugins
  }
}
