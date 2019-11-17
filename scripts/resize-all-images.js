const fs = require('fs')
const path = require('path')
const resizeImage = require('./util/resize-image')

const dataDir = path.join(__dirname, '../data')
const newSize = 1024 // pixels max canvas size

try {
  fs.accessSync(dataDir, fs.constants.F_OK)
  console.log(`${dataDir} exists`)
} catch (err) {
  console.log(`ERROR ${dataDir} does not exist`)
}

fs.readdir(`${dataDir}`, {}, (err, files) => {
  files.forEach(file => {
    const fileExt = path.extname(file)
    if (fileExt === '.jpg') {
      const filePath = path.join(dataDir, file)
      resizeImage(filePath, newSize)
    }
  })
})
