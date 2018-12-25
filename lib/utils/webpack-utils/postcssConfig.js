'use strict'

// TODO: seems now autoprefixer is deprecated, should it be updated @zhangtingcen
const autoprefixer = require('./getAutoprefixer')()

module.exports = function () {
  return [autoprefixer]
}
