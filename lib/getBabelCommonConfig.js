'use strict'

const argv = require('minimist')(process.argv.slice(2))

module.exports = function (modules) {
  const plugins = [
    '@babel/plugin-proposal-function-bind',
    ['@babel/plugin-proposal-pipeline-operator', { 'proposal': 'minimal' }]
  ]
  if (modules !== false) {
    plugins.push(require.resolve('babel-plugin-add-module-exports'))
  }
  // TODO: why use babel-runtime @zhangtingcen
  if (argv['babel-runtime']) {
    plugins.push([
      require.resolve('babel-plugin-transform-runtime'),
      {
        polyfill: false
      }
    ])
  }
  return {
    presets: [].concat(
      ['react'].map(name => {
        return require(`@babel/preset-${name}`)
      })
    ),
    plugins
  }
}
