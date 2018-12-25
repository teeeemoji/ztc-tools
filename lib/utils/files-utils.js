'use strict'

const {join, dirname} = require('path')
const fs = require('fs')
const fse = require('fs-extra')

const cwd = process.cwd()

function removeFolder(path) {
  if (fs.existsSync(path)) {
    fse.removeSync(path)
  }
}



module.exports = {
  removeFolder
}
