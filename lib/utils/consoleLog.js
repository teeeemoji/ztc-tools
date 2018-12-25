var chalk = require('chalk')

const fatal = function (log) {
  return chalk.red(log)
}

const fatalLog = function (log) {
  console.log(chalk`
  {bgRed.bold [FATAL]   }
          ${fatal(log)}
`)
}

const error = function (log) {
  return chalk.red(log)
}

const errorLog = function (log) {
  console.log(chalk`
  {red.bold [ERROR]   }
          ${error(log)}
`)
}

const warning = function (log) {
  return chalk.yellow(log)
}

const warningLog = function (log) {
  console.log(chalk`
  {yellow.bold [WARNING] }
          ${warning(log)}
`)
}

const debugLog = function (log) {
  console.log(`
  [DEBUG]    
          ${log}
`)
}

const info = function (log) {
  return chalk.cyan(log)
}

const infoLog = function (log) {
  console.log(chalk`
  {cyan.bold [INFO]    }
          ${info(log)}
`)
}

const success = function (log) {
  return chalk.green(log)
}

const successLog = function (log) {
  console.log(chalk`
  {green.bold [SUCCESS] }
         ${success(log)}
`)
}

module.exports = {
  fatal,
  fatalLog,
  error,
  errorLog,
  warning,
  warningLog,
  debugLog,
  info,
  infoLog,
  success,
  successLog
}
