const fs = require('fs')
const exec = require('child_process').exec

// image quality
const dpi = 10 // 100 // 300

// check if data dir exists
const dataDir = '../data'
try {
  fs.accessSync(dataDir, fs.constants.F_OK)
  console.log(`${dataDir} exists`)
} catch (err) {
  console.log(`ERROR ${dataDir} does not exist`)
}

fs.readdir(`${dataDir}`, {}, (err, files) => {
  files.forEach(file => {
    // run pdf to text on that file
    const escapedFilename = file.replace(/(\s+)/g, '\\$1')
    const fileStem = escapedFilename.replace('.pdf', '')
    const outFile = `${fileStem}_${dpi}dpi.jpg`
    const command = `sh pdf-to-jpg-first-page.sh ${dataDir}/${escapedFilename} ${dataDir}/${outFile} ${dpi}`
    const child = exec(command, (error, stdout, stderr) => {
      if (stdout && String(stdout).length > 0) {
        console.log(`stdout: ${stdout}`)
      }
      if (stderr && String(stderr).length > 0) {
        console.log(`stderr: ${stderr}`)
      }
      if (error !== null) {
        console.log(`exec error: ${error}`)
      }
    })
  })
})
