'use strict'

const argv = require('minimist')(process.argv.slice(2))

module.exports = function () {
  const plugins = [
    require.resolve('@babel/plugin-proposal-function-bind'),
    [require.resolve('@babel/plugin-proposal-pipeline-operator'), {'proposal': 'minimal'}]
  ]
  // TODO: why use babel-runtime @zhangtingcen
  if (argv['babel-runtime']) {
    plugins.push([
      require.resolve('@babel/plugin-transform-runtime'),
      {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false
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
