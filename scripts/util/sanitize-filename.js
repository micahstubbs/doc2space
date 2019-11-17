const filenamify = require('filenamify')

module.exports = filename => {
  // return filenamify(filename, { replacement: '-' }).replace(/[\s\(\))]/g, '-')
  return encodeURIComponent(filename)
}
