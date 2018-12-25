'use strict'

const path = require('path')
const fs = require('fs')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const resolveCwd = require('../resolveCwd')
const {removeFolder} = require('../files-utils')


const cwd = process.cwd()
const root = cwd
const compName = path.basename(root)

/**
 * 获取组件 examples 中的所有组件
 * @return {{}}
 */
function getDemos() {
  const exampleDir = resolveCwd('examples')

  const files = fs.readdirSync(exampleDir)
  const demos = {}
  files.forEach(file => {
    const extname = path.extname(file)
    const name = path.basename(file, extname)
    if (extname === '.js' || extname === '.jsx' || extname === '.tsx' || extname === '.ts') {
      demos[name] = path.join(exampleDir, file)
    }
  })
  return demos
}

/**
 * 根据 demos 生成 temp entry 并且输出 entry
 */
function generateTmpEntry(demos) {
  const tmpEntryPath = path.join(__dirname, './tmp')
  const nodeModulesPath = path.join(__dirname, '../../../node_modules')

  removeFolder(tmpEntryPath)
  fs.mkdir(tmpEntryPath)

  const tmpEntryTemplate = fs.readFileSync(path.join(__dirname, './templates/entry-template.js'), 'utf8')

  for (let demo in demos) {
    let tmpEntryFilePath = path.join(tmpEntryPath, `${demo}.js`)
    fs.writeFileSync(tmpEntryFilePath, tmpEntryTemplate.replace('${DemoName}', demo))
    demos[demo] = [
      path.join(nodeModulesPath, 'react-hot-loader/patch'),
      path.join(nodeModulesPath, 'webpack-hot-middleware/client?reload=true&timeout=2000&overlay=false'),
      tmpEntryFilePath
    ]
  }

  return demos
}

/**
 * 为每一个 example 生成一个 html 入口文件
 * @param entry
 * @return {HtmlWebpackPlugin[]}
 */
function getMultipleHtmlPluginConfig(entry) {
  const template = path.join(__dirname, './templates/comp-default.html')
  return Object.keys(entry).map(key => new HtmlWebpackPlugin({
    title: `${key} [${compName}]`,
    filename: `${key}.html`,
    template,
    chunks: [`${key}`]
  }))
}

/**
 * 获取组件 examples 中的所有入口文件
 * @return {{}}
 */
function getEntryAndHtmlPlugins() {
  let demos = getDemos()
  let entry = generateTmpEntry(demos)
  let htmlPlugins = getMultipleHtmlPluginConfig(entry)
  return {entry, htmlPlugins}
}

module.exports = getEntryAndHtmlPlugins

