const filenamify = require('filenamify')
const path = require('path')

module.exports = filename => {
  const extName = path.extname(filename)
  let fileStem = filename.split('.')
  fileStem.pop()
  fileStem = fileStem.join('.')
  const sanitizedFileStem = filenamify(fileStem, { replacement: '-' })
    .replace(/-+/g, '-')
    .replace(/[\s\(\))\[\]\.,]/g, '-')
    .replace(/-$/, '')
  return `${sanitizedFileStem}${extName}`
}
