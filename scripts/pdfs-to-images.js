const fs = require('fs')
const exec = require('child_process').exec
const path = require('path')
const writeJson = require('./writeJson.js')

// image quality
const minLegibleTitleDpi = 50
const minLegibleAbstractDpi = 87
const hiResDpi = 600
const dpi = hiResDpi // 87 // 75 // 50 // 10 // 100 // 300

const errorFiles = []

// check if data dir exists
const dataDir = '../data'
const logDir = './logs'
try {
  fs.accessSync(dataDir, fs.constants.F_OK)
  console.log(`${dataDir} exists`)
} catch (err) {
  console.log(`ERROR ${dataDir} does not exist`)
}

try {
  fs.accessSync(logDir, fs.constants.F_OK)
  console.log(`${logDir} exists`)
} catch (err) {
  console.log(`creating ${logDir}`)
  fs.mkdirSync(logDir)
}

fs.readdir(`${dataDir}`, {}, (err, files) => {
  files.forEach(file => {
    const fileExt = path.extname(file)
    if (fileExt === '.pdf') {
      // run pdf to text on that file
      const escapedFilename = file.replace(/(\s+)/g, '\\$1')
      const fileStem = escapedFilename.replace('.pdf', '')
      const outFile = `${fileStem}_${dpi}dpi.jpg`

      try {
        // first check to see if the image already exists
        const currentPath = `${dataDir}/${outFile}`
        fs.accessSync(currentPath)
        console.log(`image exists: ${dataDir}/${outFile}`)
      } catch (err) {
        // if not generate the image from the pdf
        const command = `sh pdf-to-jpg-first-page.sh ${dataDir}/${escapedFilename} ${dataDir}/${outFile}`
        console.log(command)
        const child = exec(command, (error, stdout, stderr) => {
          if (stdout && String(stdout).length > 0) {
            console.log(`stdout: ${stdout}`)
          }
          if (stderr && String(stderr).length > 0) {
            console.log(`stderr: ${stderr}`)
            errorFiles.push(file)
          }
          if (error !== null) {
            console.log(`exec error: ${error}`)
          }
        })
      }
    }
  })

  writeJson(errorFiles, `${logDir}/pdfs-to-images-error-files.json`)
})
