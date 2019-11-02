const runShellCommand = require('./run-shell-command.js')

// https://cloud.google.com/nodejs/getting-started/using-cloud-storage
const bucketName = process.env.DOC2SPACE_BUCKET_NAME
const command = `gsutil defacl set public-read gs://${bucketName}`
runShellCommand(command)



