const fs = require('fs')
const path = require('path')
const resizeImage = require('./util/resize-image')

const dataDir = path.join(__dirname, '../data')

try {
  fs.accessSync(dataDir, fs.constants.F_OK)
  console.log(`${dataDir} exists`)
} catch (err) {
  console.log(`ERROR ${dataDir} does not exist`)
}

let counter = 0
fs.readdir(`${dataDir}`, {}, (err, files) => {
  files.some(file => {
    const fileExt = path.extname(file)
    if (fileExt === '.jpg') {
      const filePath = path.join(dataDir, file)
      resizeImage(filePath)
      counter += 1
    }
    if (counter > 0) return true
  })
})
