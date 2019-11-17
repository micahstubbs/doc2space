const runShellCommand = require('../util/run-shell-command.js')

// https://cloud.google.com/nodejs/getting-started/using-cloud-storage
const bucketName = process.env.DOC2SPACE_BUCKET_NAME
const command = `gsutil mb gs://${bucketName}`
runShellCommand(command)



