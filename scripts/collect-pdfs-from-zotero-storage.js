const fs = require('fs')
readline = require('readline')

// check if data dir exists
// if not, create it
const dataDir = '../data'
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
    output: process.stdout
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

// recursively traverse ZOTERO_STORAGE
// copy all pdfs to dataDir
// if names conflict, append some identifier to second file
