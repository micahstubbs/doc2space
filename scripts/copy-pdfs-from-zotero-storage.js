const fs = require('fs')
const readline = require('readline')
const path = require('path')
const sanitizeFilename = require('./sanitize-filename')

// check if data dir exists
// if not, create it
const dataDir = path.join(__dirname, '../data')
try {
  fs.accessSync(dataDir, fs.constants.F_OK)
  console.log(`${dataDir} exists`)
} catch (err) {
  console.log(`${dataDir} does not exist`)
  fs.mkdir(dataDir, {}, err => {
    if (err) {
      console.log(err)
    } else {
      console.log(`${dataDir} created`)
    }
  })
}

// check if ZOTERO_STORAGE environment variable exists
// if not, prompt the user for the Zotero Storage path
console.log('process.env.ZOTERO_STORAGE  ', process.env.ZOTERO_STORAGE)
let zoteroStorageDir = process.env.ZOTERO_STORAGE

if (!zoteroStorageDir) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })

  rl.question(
    `What is the full path to your Zotero Storage directory?\n`,
    dir => {
      zoteroStorageDir = dir
      console.log('zoteroStorageDir is now:', zoteroStorageDir)
      rl.close()
    }
  )
}

// extra spaces so that output lines up with ENV variable output
console.log('zoteroStorageDir            ', zoteroStorageDir)

// check if Zotero Storage Dir exists
try {
  fs.accessSync(zoteroStorageDir, fs.constants.F_OK)
  console.log(`${zoteroStorageDir} exists`)
} catch (err) {
  console.log(`ERROR ${zoteroStorageDir} does not exist`)
}

// get a list of all child directories
const getDirectories = srcPath => {
  return fs
    .readdirSync(srcPath)
    .filter(file => fs.lstatSync(path.join(srcPath, file)).isDirectory())
}

const dirs = getDirectories(zoteroStorageDir).filter(dir => dir !== '.git')
console.log('dirs', dirs)

const filesHash = {}

// visit every child dir in ZOTERO_STORAGE
dirs.forEach((dir, i) => {
  // get a list of all files
  fs.readdir(`${zoteroStorageDir}/${dir}`, {}, (err, files) => {
    // console.log('dir', dir)
    files.forEach(file => {
      const fileExt = path.extname(file)
      let newFilename = sanitizeFilename(file)
      if (fileExt === '.pdf') {
        // if we have already seen a file with the same name
        // create a new file name for this file with an identifier appended
        if (filesHash[file]) {
          newFilename = `${newFilename.slice(0, -4)}-${i}${fileExt}`
          console.log('newFilename', newFilename)
        }
        filesHash[file] = true
        // console.log('file', file)

        // copy this file to the dataDir
        const src = `${zoteroStorageDir}/${dir}/${file}`
        const dest = `${dataDir}/${newFilename}`
        fs.copyFile(src, dest, {}, err => {
          if (err) console.log(`ERROR copying file ${src} to ${dest}`)
        })
      }
    })
  })
})
