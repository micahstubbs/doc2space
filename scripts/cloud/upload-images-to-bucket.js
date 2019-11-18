const { Storage } = require('@google-cloud/storage')
const fs = require('fs')
const path = require('path')

const bucketName = process.env.DOC2SPACE_BUCKET_NAME
const projectId = process.env.GCP_PROJECT_ID
const keyFilename = process.env.GOOGLE_APPLICATION_CREDENTIALS
const targetExt = '.jpg'

// https://stackoverflow.com/questions/48919153/upload-file-to-google-cloud-storage-with-nodejs
function uploadToBucket({
  bucketName,
  projectId,
  keyFilename,
  uploadFilename,
}) {
  const gcs = new Storage({
    projectId,
    keyFilename,
  })
  const bucket = gcs.bucket(bucketName)
  bucket.upload(uploadFilename, function(err, file) {
    if (err) throw new Error(err)
  })
}

// check if data dir exists
const dataDir = path.join(__dirname, '../../data')
try {
  fs.accessSync(dataDir, fs.constants.F_OK)
  console.log(`${dataDir} exists`)
} catch (err) {
  console.log(`ERROR ${dataDir} does not exist`)
}

console.log(
  `now uploading ${targetExt} files from ${dataDir} to bucket ${bucketName}`
)

fs.readdir(`${dataDir}`, {}, (err, files) => {
  files.forEach((file, i) => {
    const fileExt = path.extname(file)

    if (fileExt === targetExt) {
      const uploadFilename = `${dataDir}/${file}`

      console.log(`${file} uploading`)

      uploadToBucket({
        bucketName,
        projectId,
        keyFilename,
        uploadFilename,
      })
    }
  })
})
