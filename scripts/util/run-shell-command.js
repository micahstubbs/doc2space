const fs = require('fs')
const exec = require('child_process').exec

module.exports = function(command) {
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
}
