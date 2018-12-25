#!/usr/bin/env node

const commander = require('commander')

const {infoLog, info, successLog} = require('../utils/consoleLog')

const printHelpContent = function (content, desc) {
  const prifix = info('$'.padStart(12))
  console.log(prifix, info(content.padEnd(30)), desc)
}

commander.on('--help', () => {
  infoLog('Usage:')
  console.log()
  printHelpContent('ztc-tools run lint', 'lint source within lib')
  printHelpContent('ztc-tools run start', 'start server')
  printHelpContent('ztc-tools run build', 'build')
  printHelpContent('ztc-tools run pub', 'publish component')
  printHelpContent('ztc-tools run pretter', 'pretter all code')
  printHelpContent('ztc-tools run test', 'test component')
  printHelpContent('ztc-tools run init-eslint', 'generate eslint configuration file')
  printHelpContent('ztc-tools run chrome-test', 'run chrome tests')
  console.log()
})

commander.parse(process.argv)

const task = commander.args[0]

if (!task) {
  commander.help()
} else if (task === 'start') {
  const port = process.env.npm_package_config_port || 8000
  successLog(`Listening at http://localhost:${port}`)
  const app = require('../server/')()
  app.listen(port)
} else if (task === 'build') {
  infoLog('Now Start Building')
  const builder = require('../release/build')
  builder()
}
