#!/usr/bin/env node

'use strict'

const commander = require('commander')
const packageInfo = require('../../package.json')

commander
  .version(packageInfo.version)
  .command('run [name]', 'run specified task')
  .parse(process.argv)

// https://github.com/tj/commander.js/pull/260
const proc = commander.runningCommand
if (proc) {
  proc.on('close', process.exit.bind(process))
  proc.on('error', () => {
    process.exit(1)
  })
}

process.on('SIGINT', () => {
  if (proc) {
    proc.kill('SIGKILL')
  }
  process.exit(0)
})

const subCmd = commander.args[0]
if (!subCmd || subCmd !== 'run') {
  commander.help()
}
